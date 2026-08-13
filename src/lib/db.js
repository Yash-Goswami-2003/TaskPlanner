import neo4j from 'neo4j-driver';

/**
 * CognoDB / Neo4j Graph Database Driver Utility
 * Reads connection URI and credentials strictly from .env.local
 */

let driverInstance = null;

export function getCognoDBDriver() {
  const uri = process.env.COGNODB_URI || 'bolt+s://db-797445ed.databases.cognodb.com';
  const user = process.env.COGNODB_USER || 'neo4j';
  const password = process.env.COGNODB_PASSWORD || '';

  if (driverInstance) {
    return driverInstance;
  }

  try {
    driverInstance = neo4j.driver(uri, neo4j.auth.basic(user, password));
    console.log('[CognoDB] Driver initialized successfully for URI:', uri);
    return driverInstance;
  } catch (err) {
    console.error('[CognoDB] Driver initialization error:', err);
    return null;
  }
}

export async function executeCypherQuery(cypher, params = {}) {
  const driver = getCognoDBDriver();
  if (!driver) {
    throw new Error('CognoDB driver is not initialized.');
  }

  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result;
  } catch (error) {
    console.error('[CognoDB] Error executing Cypher query:', error);
    throw error;
  } finally {
    await session.close();
  }
}
