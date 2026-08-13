import { NextResponse } from 'next/server';
import { executeCypherQuery } from '../../../lib/db';
import { getTokenFromRequest, verifyToken } from '../../../lib/jwt';

// GET: Fetch tasks (all, mailbox assigned, or single task by id) from CognoDB
export async function GET(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    const companyName = decoded?.companyName || 'Acme Tech';
    const currentUserName = decoded?.userName || 'Admin';

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('id');
    const mailboxOnly = searchParams.get('mailbox') === 'true';

    // 1. Fetch single task by ID
    if (taskId) {
      const cypher = `
        MATCH (t:Task {id: $taskId})
        OPTIONAL MATCH (allE:Employee)-[:ASSIGNED_TO]->(t)
        RETURN t, collect(DISTINCT allE.name) AS assignees
      `;
      const res = await executeCypherQuery(cypher, { taskId });

      if (!res.records || res.records.length === 0) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      const rec = res.records[0];
      const t = rec.get('t').properties;
      const assignees = rec.get('assignees') || [];

      return NextResponse.json({
        task: {
          id: t.id,
          title: t.title,
          description: t.description || '',
          priority: t.priority || 'P1',
          status: t.status || 'In Progress',
          dueDate: t.dueDate || new Date().toISOString().split('T')[0],
          createdAt: t.createdAt,
          assignees: assignees.filter(Boolean)
        }
      });
    }

    // 2. Fetch list of tasks (mailbox or all)
    let cypher = '';
    let params = { companyName, currentUserName };

    if (mailboxOnly) {
      cypher = `
        MATCH (e:Employee {name: $currentUserName})-[:ASSIGNED_TO]->(t:Task)
        OPTIONAL MATCH (allE:Employee)-[:ASSIGNED_TO]->(t)
        RETURN t, collect(DISTINCT allE.name) AS assignees
        ORDER BY t.createdAt DESC
      `;
    } else {
      cypher = `
        MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
        MATCH (e)-[:ASSIGNED_TO]->(t:Task)
        WITH DISTINCT t
        OPTIONAL MATCH (allE:Employee)-[:ASSIGNED_TO]->(t)
        RETURN t, collect(DISTINCT allE.name) AS assignees
        ORDER BY t.createdAt DESC
      `;
    }

    const res = await executeCypherQuery(cypher, params);

    const tasks = res.records.map((r) => {
      const t = r.get('t').properties;
      const assignees = r.get('assignees') || [];
      return {
        id: t.id,
        title: t.title,
        description: t.description || '',
        priority: t.priority || 'P1',
        status: t.status || 'In Progress',
        dueDate: t.dueDate || new Date().toISOString().split('T')[0],
        createdAt: t.createdAt,
        assignees: assignees.filter(Boolean)
      };
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Fetch Tasks Error:', error);
    return NextResponse.json({ tasks: [] });
  }
}

// POST: Create a new task in CognoDB
export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
    }

    const { title, description, priority, dueDate, assignees } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Task title is required.' }, { status: 400 });
    }

    const taskId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
    const companyName = decoded.companyName;
    const cleanAssignees = Array.isArray(assignees) ? assignees : [];

    // 1. Create Task Node in CognoDB
    const createTaskCypher = `
      CREATE (t:Task {
        id: $taskId,
        title: $title,
        description: $description,
        priority: $priority,
        dueDate: $dueDate,
        status: 'In Progress',
        createdAt: timestamp()
      })
      RETURN t
    `;
    await executeCypherQuery(createTaskCypher, {
      taskId,
      title: title.trim(),
      description: description || '',
      priority: priority || 'P1',
      dueDate: dueDate || new Date().toISOString().split('T')[0]
    });

    // 2. Link selected assignees to the Task
    for (const empName of cleanAssignees) {
      const linkCypher = `
        MATCH (e:Employee {name: $empName}), (t:Task {id: $taskId})
        MERGE (e)-[r:ASSIGNED_TO]->(t)
      `;
      await executeCypherQuery(linkCypher, { empName, taskId });
    }

    if (cleanAssignees.length === 0) {
      const linkCreatorCypher = `
        MATCH (e:Employee {name: $creatorName}), (t:Task {id: $taskId})
        MERGE (e)-[r:ASSIGNED_TO]->(t)
      `;
      await executeCypherQuery(linkCreatorCypher, { creatorName: decoded.userName, taskId });
      cleanAssignees.push(decoded.userName);
    }

    return NextResponse.json({
      success: true,
      task: {
        id: taskId,
        title: title.trim(),
        description: description || '',
        priority: priority || 'P1',
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        status: 'In Progress',
        assignees: cleanAssignees
      }
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create task in CognoDB.' },
      { status: 500 }
    );
  }
}

// PATCH: Update task description or details in CognoDB
export async function PATCH(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { taskId, description, dueDate, priority, assignees } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required.' }, { status: 400 });
    }

    // Update Task properties in CognoDB
    const updateCypher = `
      MATCH (t:Task {id: $taskId})
      SET t.description = $description,
          t.dueDate = $dueDate,
          t.priority = $priority,
          t.updatedAt = timestamp()
      RETURN t
    `;
    await executeCypherQuery(updateCypher, {
      taskId,
      description: description || '',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority: priority || 'P1'
    });

    if (Array.isArray(assignees)) {
      await executeCypherQuery(`MATCH (e:Employee)-[r:ASSIGNED_TO]->(t:Task {id: $taskId}) DELETE r`, { taskId });
      for (const empName of assignees) {
        await executeCypherQuery(`
          MATCH (e:Employee {name: $empName}), (t:Task {id: $taskId})
          MERGE (e)-[r:ASSIGNED_TO]->(t)
        `, { empName, taskId });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Task Error:', error);
    return NextResponse.json({ error: 'Failed to update task.' }, { status: 500 });
  }
}

// DELETE: Delete a task from CognoDB
export async function DELETE(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required for deletion.' }, { status: 400 });
    }

    const deleteCypher = `
      MATCH (t:Task {id: $taskId})
      DETACH DELETE t
    `;
    await executeCypherQuery(deleteCypher, { taskId });

    return NextResponse.json({ success: true, message: `Task ${taskId} deleted.` });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return NextResponse.json({ error: 'Failed to delete task.' }, { status: 500 });
  }
}
