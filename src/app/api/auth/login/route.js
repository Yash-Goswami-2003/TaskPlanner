import { NextResponse } from 'next/server';
import { executeCypherQuery } from '../../../../lib/db';
import { signToken } from '../../../../lib/jwt';

export async function POST(req) {
  try {
    const body = await req.json();
    const { mode, companyName, adminPassword, userName, userPassword } = body;

    const cleanCompanyName = (companyName || '').trim();

    // 1. ORGANIZATION ADMIN LOGIN MODE
    if (mode === 'org_admin') {
      if (!cleanCompanyName || !adminPassword) {
        return NextResponse.json(
          { error: 'Company name and admin password are required.' },
          { status: 400 }
        );
      }

      // Step A: Verify Organization existence first
      const orgCheckCypher = `MATCH (o:Organization {name: $companyName}) RETURN o`;
      const orgCheckRes = await executeCypherQuery(orgCheckCypher, { companyName: cleanCompanyName });

      if (!orgCheckRes.records || orgCheckRes.records.length === 0) {
        return NextResponse.json(
          { error: `Organization "${cleanCompanyName}" does not exist. Please register your organization first.` },
          { status: 404 }
        );
      }

      // Step B: Strictly match Admin password in CognoDB
      const adminMatchCypher = `
        MATCH (e:Employee {password: $adminPassword, role: 'Admin'})-[:MEMBER_OF]->(o:Organization {name: $companyName})
        RETURN e, o
      `;
      const adminRes = await executeCypherQuery(adminMatchCypher, {
        companyName: cleanCompanyName,
        adminPassword
      });

      if (!adminRes.records || adminRes.records.length === 0) {
        return NextResponse.json(
          { error: `Incorrect admin password for organization "${cleanCompanyName}". Access denied.` },
          { status: 401 }
        );
      }

      // Step C: Issue JWT Token ONLY on successful password match
      const token = signToken({
        companyName: cleanCompanyName,
        userName: 'Admin',
        role: 'Admin'
      });

      return NextResponse.json({
        success: true,
        token,
        user: { companyName: cleanCompanyName, userName: 'Admin', role: 'Admin' }
      });
    }

    // 2. TEAM MEMBER USER LOGIN MODE
    if (mode === 'user_member') {
      if (!cleanCompanyName || !userName || !userPassword) {
        return NextResponse.json(
          { error: 'Company name, user name, and user password are required.' },
          { status: 400 }
        );
      }

      const cleanUserName = userName.trim();

      // Step A: Verify Organization existence
      const orgCheckCypher = `MATCH (o:Organization {name: $companyName}) RETURN o`;
      const orgCheckRes = await executeCypherQuery(orgCheckCypher, { companyName: cleanCompanyName });

      if (!orgCheckRes.records || orgCheckRes.records.length === 0) {
        return NextResponse.json(
          { error: `Organization "${cleanCompanyName}" does not exist.` },
          { status: 404 }
        );
      }

      // Step B: Verify User node existence under this Organization
      const userCheckCypher = `
        MATCH (e:Employee {name: $userName})-[:MEMBER_OF]->(o:Organization {name: $companyName})
        RETURN e
      `;
      const userCheckRes = await executeCypherQuery(userCheckCypher, {
        companyName: cleanCompanyName,
        userName: cleanUserName
      });

      if (!userCheckRes.records || userCheckRes.records.length === 0) {
        return NextResponse.json(
          { error: `User "${cleanUserName}" does not exist in organization "${cleanCompanyName}". Please contact your Admin to create your account.` },
          { status: 404 }
        );
      }

      // Step C: Strictly match User password in CognoDB
      const userMatchCypher = `
        MATCH (e:Employee {name: $userName, password: $userPassword})-[:MEMBER_OF]->(o:Organization {name: $companyName})
        RETURN e, o
      `;
      const userRes = await executeCypherQuery(userMatchCypher, {
        companyName: cleanCompanyName,
        userName: cleanUserName,
        userPassword
      });

      if (!userRes.records || userRes.records.length === 0) {
        return NextResponse.json(
          { error: `Incorrect password for user "${cleanUserName}". Access denied.` },
          { status: 401 }
        );
      }

      const matchedEmployee = userRes.records[0].get('e').properties;

      // Step D: Issue JWT Token ONLY on successful password match
      const token = signToken({
        companyName: cleanCompanyName,
        userName: cleanUserName,
        role: matchedEmployee.role || 'Member'
      });

      return NextResponse.json({
        success: true,
        token,
        user: { companyName: cleanCompanyName, userName: cleanUserName, role: matchedEmployee.role || 'Member' }
      });
    }

    return NextResponse.json({ error: 'Invalid login mode.' }, { status: 400 });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Database error occurred during login.' },
      { status: 500 }
    );
  }
}
