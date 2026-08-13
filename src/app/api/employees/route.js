import { NextResponse } from 'next/server';
import { executeCypherQuery } from '../../../lib/db';
import { getTokenFromRequest, verifyToken } from '../../../lib/jwt';

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    const companyName = decoded?.companyName || 'Acme Tech';

    const cypher = `
      MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
      RETURN e.name AS name, e.role AS role, e.createdAt AS createdAt
    `;
    const res = await executeCypherQuery(cypher, { companyName });

    const employees = res.records.map((r) => ({
      name: r.get('name'),
      role: r.get('role'),
      initials: (r.get('name') || 'US').split(' ').map((n) => n[0]).join('').toUpperCase()
    }));

    return NextResponse.json({ employees });
  } catch (error) {
    return NextResponse.json({ employees: [] });
  }
}

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Only Organization Admins can create new employees.' },
        { status: 403 }
      );
    }

    const { userName, userPassword, role } = await req.json();
    if (!userName || !userName.trim() || !userPassword) {
      return NextResponse.json(
        { error: 'Employee user name and password are required.' },
        { status: 400 }
      );
    }

    const cleanUserName = userName.trim();
    const companyName = decoded.companyName;

    // Create Employee node and link to Organization
    const cypher = `
      MATCH (o:Organization {name: $companyName})
      MERGE (e:Employee {name: $userName})
      ON CREATE SET e.role = $role, e.password = $userPassword, e.createdAt = timestamp()
      MERGE (e)-[r:MEMBER_OF]->(o)
      RETURN e, o
    `;

    await executeCypherQuery(cypher, {
      companyName,
      userName: cleanUserName,
      userPassword,
      role: role || 'Member'
    });

    return NextResponse.json({
      success: true,
      message: `Employee "${cleanUserName}" created under organization "${companyName}".`
    });
  } catch (error) {
    console.error('Create Employee Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create employee.' },
      { status: 500 }
    );
  }
}
