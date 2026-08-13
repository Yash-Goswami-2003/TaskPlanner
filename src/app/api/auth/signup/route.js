import { NextResponse } from 'next/server';
import { executeCypherQuery } from '../../../../lib/db';

export async function POST(req) {
  try {
    const { companyName, adminPassword, teamSize } = await req.json();

    if (!companyName || !companyName.trim() || !adminPassword) {
      return NextResponse.json(
        { error: 'Company name and admin password are required.' },
        { status: 400 }
      );
    }

    const cleanCompanyName = companyName.trim();

    // 1. Check if Organization already exists in CognoDB
    const checkCypher = `
      MATCH (o:Organization {name: $companyName})
      RETURN o
    `;
    const checkResult = await executeCypherQuery(checkCypher, { companyName: cleanCompanyName });

    if (checkResult.records && checkResult.records.length > 0) {
      return NextResponse.json(
        { error: `Organization "${cleanCompanyName}" already exists. Please choose a different company name or perform Organization Login.` },
        { status: 400 }
      );
    }

    // 2. Create new Organization Node and Admin Node linked via MEMBER_OF relationship
    const createCypher = `
      CREATE (o:Organization {name: $companyName, createdAt: timestamp(), status: 'Active', teamSize: $teamSize})
      CREATE (e:Employee {name: 'Admin', role: 'Admin', password: $adminPassword})
      CREATE (e)-[r:MEMBER_OF]->(o)
      RETURN o, e
    `;

    await executeCypherQuery(createCypher, {
      companyName: cleanCompanyName,
      adminPassword,
      teamSize: teamSize || '1-10'
    });

    return NextResponse.json({
      success: true,
      message: `Organization "${cleanCompanyName}" created successfully with Admin node.`
    });
  } catch (error) {
    console.error('Org Signup Error:', error);
    return NextResponse.json(
      { error: error.message || 'Database error occurred during organization signup.' },
      { status: 500 }
    );
  }
}
