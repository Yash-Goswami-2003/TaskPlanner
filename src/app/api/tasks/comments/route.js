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

    const comments = res.records.map((rec) => ({
      author: rec.get('author'),
      content: rec.get('content'),
      createdAt: rec.get('createdAt')
    }));

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

    const cypher = `
      MATCH (e:Employee {name: $userName}), (t:Task {id: $taskId})
      CREATE (e)-[r:COMMENTED_ON {content: $content, createdAt: timestamp()}]->(t)
      RETURN r
    `;

    await executeCypherQuery(cypher, {
      userName,
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
