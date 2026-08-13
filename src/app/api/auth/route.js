import { NextResponse } from 'next/server';
import { executeCypherQuery } from '../../../lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { type } = body;

    // 1. ORGANIZATIONAL SIGN UP
    if (type === 'org_signup') {
      const { companyName, adminName, adminPassword } = body;
      if (!companyName || !adminName || !adminPassword) {
        return NextResponse.json(
          { error: 'Missing required fields for organization sign up.' },
          { status: 400 }
        );
      }

      // Check if organization already exists
      const checkCypher = `
        MATCH (o:Organization {name: $companyName})
        RETURN o
      `;
      const checkResult = await executeCypherQuery(checkCypher, { companyName });

      if (checkResult.records && checkResult.records.length > 0) {
        return NextResponse.json(
          { error: `Organization "${companyName}" already exists. Please choose another name or perform Organization Login.` },
          { status: 400 }
        );
      }

      // Create new Organization and Admin node
      const createCypher = `
        CREATE (o:Organization {name: $companyName, createdAt: timestamp(), status: 'Active'})
        CREATE (e:Employee {name: $adminName, role: 'Admin', password: $adminPassword})
        CREATE (e)-[r:MEMBER_OF]->(o)
        RETURN o, e
      `;
      await executeCypherQuery(createCypher, { companyName, adminName, adminPassword });

      return NextResponse.json({
        success: true,
        message: `Organization "${companyName}" created successfully with admin "${adminName}".`
      });
    }

    // 2. USER SIGN UP
    if (type === 'user_signup') {
      const { organizationName, userName, userPassword } = body;
      if (!organizationName || !userName || !userPassword) {
        return NextResponse.json(
          { error: 'Missing required fields for user sign up.' },
          { status: 400 }
        );
      }

      // Verify that the organization exists first
      const checkOrgCypher = `
        MATCH (o:Organization {name: $organizationName})
        RETURN o
      `;
      const orgCheck = await executeCypherQuery(checkOrgCypher, { organizationName });

      if (!orgCheck.records || orgCheck.records.length === 0) {
        return NextResponse.json(
          { error: `Organization "${organizationName}" does not exist. Please check the exact name or perform Organization Sign Up first.` },
          { status: 400 }
        );
      }

      // Check if user already exists in this organization
      const checkUserCypher = `
        MATCH (e:Employee {name: $userName})-[:MEMBER_OF]->(o:Organization {name: $organizationName})
        RETURN e
      `;
      const userCheck = await executeCypherQuery(checkUserCypher, { organizationName, userName });
      if (userCheck.records && userCheck.records.length > 0) {
        return NextResponse.json(
          { error: `User "${userName}" already exists in organization "${organizationName}". Please Log In.` },
          { status: 400 }
        );
      }

      // Create new Employee node & link to Organization
      const createUserCypher = `
        MATCH (o:Organization {name: $organizationName})
        CREATE (e:Employee {name: $userName, role: 'Member', password: $userPassword})
        CREATE (e)-[r:MEMBER_OF]->(o)
        RETURN o, e
      `;
      await executeCypherQuery(createUserCypher, { organizationName, userName, userPassword });

      return NextResponse.json({
        success: true,
        message: `User "${userName}" successfully registered for organization "${organizationName}".`
      });
    }

    // 3. ORGANIZATIONAL LOGIN
    if (type === 'org_login') {
      const { companyName, adminName, adminPassword } = body;
      if (!companyName || !adminName || !adminPassword) {
        return NextResponse.json(
          { error: 'Missing required fields for organization login.' },
          { status: 400 }
        );
      }

      const loginCypher = `
        MATCH (e:Employee {name: $adminName, password: $adminPassword, role: 'Admin'})-[:MEMBER_OF]->(o:Organization {name: $companyName})
        RETURN e, o
      `;
      const res = await executeCypherQuery(loginCypher, { companyName, adminName, adminPassword });

      if (!res.records || res.records.length === 0) {
        return NextResponse.json(
          { error: `Invalid Organization Admin credentials or organization "${companyName}" does not exist.` },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Welcome back, Admin "${adminName}" of "${companyName}"!`
      });
    }

    // 4. USER LOGIN
    if (type === 'user_login') {
      const { organizationName, userName, userPassword } = body;
      if (!organizationName || !userName || !userPassword) {
        return NextResponse.json(
          { error: 'Missing required fields for user login.' },
          { status: 400 }
        );
      }

      const userLoginCypher = `
        MATCH (e:Employee {name: $userName, password: $userPassword})-[:MEMBER_OF]->(o:Organization {name: $organizationName})
        RETURN e, o
      `;
      const res = await executeCypherQuery(userLoginCypher, { organizationName, userName, userPassword });

      if (!res.records || res.records.length === 0) {
        return NextResponse.json(
          { error: `Invalid credentials for user "${userName}" under organization "${organizationName}".` },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Welcome back, "${userName}"!`
      });
    }

    return NextResponse.json({ error: 'Invalid auth request type.' }, { status: 400 });
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Database connection error during authentication.' },
      { status: 500 }
    );
  }
}
