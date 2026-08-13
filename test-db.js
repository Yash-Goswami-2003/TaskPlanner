/**
 * CognoDB Graph Database Verification & Inspection Script
 * Run using: node test-db.js
 */

const fs = require('fs');
const path = require('path');

// Read .env.local variables
let envUri = 'bolt+s://db-797445ed.databases.cognodb.com';
let envUser = 'neo4j';
let envPassword = '';

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('COGNODB_URI=')) envUri = line.split('=')[1].trim();
    if (line.startsWith('COGNODB_USER=')) envUser = line.split('=')[1].trim();
    if (line.startsWith('COGNODB_PASSWORD=')) envPassword = line.split('=')[1].trim();
  });
}

console.log('=== CognoDB Connection Test ===');
console.log('URI:', envUri);
console.log('User:', envUser);

async function runTest() {
  let driver;
  try {
    const neo4j = require('neo4j-driver');
    driver = neo4j.driver(envUri, neo4j.auth.basic(envUser, envPassword));
    const session = driver.session();

    console.log('\n--- 1. Checking All Organizations ---');
    const orgResult = await session.run('MATCH (o:Organization) RETURN o.name AS OrganizationName, o.status AS Status');
    if (orgResult.records.length === 0) {
      console.log('No organizations found in graph database yet.');
    } else {
      orgResult.records.forEach(record => {
        console.log(`- Organization: "${record.get('OrganizationName')}" (Status: ${record.get('Status')})`);
      });
    }

    console.log('\n--- 2. Checking Nodes & Relationships ---');
    const graphResult = await session.run('MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 10');
    console.log(`Retrieved ${graphResult.records.length} relationships from CognoDB.`);

    await session.close();
  } catch (err) {
    console.error('\nError connecting to CognoDB:', err.message);
  } finally {
    if (driver) await driver.close();
  }
}

runTest();
