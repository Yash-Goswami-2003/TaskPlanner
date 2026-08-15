import { NextResponse } from 'next/server';
import { executeCypherQuery } from '../../../../lib/db';
import { getTokenFromRequest, verifyToken } from '../../../../lib/jwt';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ comments: [] });
    }

    const cypher = `
      MATCH (e:Employee)-[r:COMMENTED_ON]->(t:Task {id: $taskId})
      RETURN e.name AS author, r.content AS content, r.createdAt AS createdAt
      ORDER BY r.createdAt ASC
    `;
    const res = await executeCypherQuery(cypher, { taskId });

    // Deduplicate comments to prevent multi-relationship duplication
    const seen = new Set();
    const comments = [];

    for (const rec of res.records) {
      const author = rec.get('author');
      const content = rec.get('content');
      const createdAt = rec.get('createdAt');
      const key = `${author}:${content}:${createdAt}`;

      if (!seen.has(key)) {
        seen.add(key);
        comments.push({ author, content, createdAt });
      }
    }

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Fetch Comments Error:', error);
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
    }

    const { taskId, content } = await req.json();

    if (!taskId || !content || !content.trim()) {
      return NextResponse.json({ error: 'Task ID and comment content are required.' }, { status: 400 });
    }

    const userName = decoded.userName;
    const companyName = decoded.companyName;

    // Multi-tenant scoped MATCH with LIMIT 1 to prevent duplicate relationship creation
    const cypher = `
      MATCH (e:Employee {name: $userName})-[:MEMBER_OF]->(o:Organization {name: $companyName})
      MATCH (t:Task {id: $taskId})
      WITH e, t LIMIT 1
      CREATE (e)-[r:COMMENTED_ON {content: $content, createdAt: timestamp()}]->(t)
      RETURN r
    `;

    await executeCypherQuery(cypher, {
      userName,
      companyName,
      taskId,
      content: content.trim()
    });

    return NextResponse.json({
      success: true,
      comment: {
        author: userName,
        content: content.trim(),
        createdAt: Date.now()
      }
    });
  } catch (error) {
    console.error('Create Comment Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to post comment.' },
      { status: 500 }
    );
  }
}
