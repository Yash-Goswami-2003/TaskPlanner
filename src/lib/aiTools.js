import { executeCypherQuery } from './db';

// ----------------------------------------------------------------------------
// 1. Tool Schemas for Groq / OpenAI Tool Calling Specification
// ----------------------------------------------------------------------------
export const AI_TOOLS_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'search_users',
      description: "Search for team members and employees within the authenticated user's organization.",
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Optional search keyword to match employee name or role (e.g. "Yash", "Engineer")'
          },
          role: {
            type: 'string',
            description: 'Optional role filter (e.g. "Lead AI Engineer", "Admin")'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_user_activity',
      description: "Get detailed activity profile of a specific person in the company: assigned tasks, deadlines, status breakdown, and recent comments posted by them.",
      parameters: {
        type: 'object',
        properties: {
          userName: {
            type: 'string',
            description: 'Name of the person to inspect (e.g. "Yash", "Alice", "Bob", "Admin")'
          }
        },
        required: ['userName']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_task_details',
      description: "Get full details of a specific task including title, description, dates, priority, status, assignees, and discussion comments stream.",
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Task ID (e.g. "TASK-713") or title keyword (e.g. "OAuth")'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_tasks',
      description: "Search and retrieve tasks within the user's organization graph database by assignee, status, priority, or keyword.",
      parameters: {
        type: 'object',
        properties: {
          assigneeName: {
            type: 'string',
            description: 'Filter tasks assigned to a specific user (e.g. "Yash", "Alice", "Admin")'
          },
          status: {
            type: 'string',
            enum: ['To Do', 'In Progress', 'In Review', 'Done'],
            description: 'Filter tasks by current status'
          },
          priority: {
            type: 'string',
            enum: ['P1', 'P2', 'P3', 'P4'],
            description: 'Filter tasks by priority level'
          },
          query: {
            type: 'string',
            description: 'Search keyword matching task title or description'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_project_summary',
      description: "Get high-level executive summary metrics of the organization's project (total tasks, pending count, status breakdown, and team count).",
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_task',
      description: "Create and assign a new task in the organization's graph database.",
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Short title for the task (required)'
          },
          description: {
            type: 'string',
            description: 'Detailed specifications, requirements, or implementation notes'
          },
          priority: {
            type: 'string',
            enum: ['P1', 'P2', 'P3', 'P4'],
            description: 'Priority level (default P1)'
          },
          startDate: {
            type: 'string',
            description: 'Start date in YYYY-MM-DD format'
          },
          dueDate: {
            type: 'string',
            description: 'Due date in YYYY-MM-DD format'
          },
          assignees: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of team member names to assign (e.g. ["Yash", "Alice"])'
          }
        },
        required: ['title']
      }
    }
  }
];

// ----------------------------------------------------------------------------
// 2. Tool Execution Logic (Enforces Tenant Security via $companyName)
// ----------------------------------------------------------------------------
export async function executeAiTool(toolName, args, companyName, currentUserName) {
  try {
    switch (toolName) {
      case 'search_users': {
        const query = (args.query || '').trim();
        const role = (args.role || '').trim();

        const cypher = `
          MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
          WHERE ($query = '' OR toLower(e.name) CONTAINS toLower($query) OR toLower(e.role) CONTAINS toLower($query))
            AND ($role = '' OR toLower(e.role) = toLower($role))
          RETURN e.name AS name, e.role AS role
        `;

        const res = await executeCypherQuery(cypher, { companyName, query, role });
        const users = res.records.map((r) => ({
          name: r.get('name'),
          role: r.get('role')
        }));

        return {
          success: true,
          companyName,
          total: users.length,
          users
        };
      }

      case 'get_user_activity': {
        const targetUserName = (args.userName || currentUserName).trim();

        // 1. Tasks assigned to target user
        const tasksCypher = `
          MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
          WHERE toLower(e.name) CONTAINS toLower($targetUserName)
          MATCH (e)-[:ASSIGNED_TO]->(t:Task)
          OPTIONAL MATCH (allE:Employee)-[:ASSIGNED_TO]->(t)
          RETURN t, collect(DISTINCT allE.name) AS assignees
          ORDER BY t.createdAt DESC
        `;
        const tasksRes = await executeCypherQuery(tasksCypher, { companyName, targetUserName });

        const tasks = tasksRes.records.map((r) => {
          const t = r.get('t').properties;
          return {
            id: t.id,
            title: t.title,
            description: t.description || '',
            priority: t.priority || 'P1',
            status: t.status || 'In Progress',
            startDate: t.startDate || 'N/A',
            dueDate: t.dueDate || 'N/A',
            assignees: (r.get('assignees') || []).filter(Boolean)
          };
        });

        // 2. Comments posted by target user
        const commentsCypher = `
          MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
          WHERE toLower(e.name) CONTAINS toLower($targetUserName)
          MATCH (e)-[r:COMMENTED_ON]->(t:Task)
          RETURN t.id AS taskId, t.title AS taskTitle, r.content AS content, r.createdAt AS createdAt
          ORDER BY r.createdAt DESC
        `;
        const commentsRes = await executeCypherQuery(commentsCypher, { companyName, targetUserName });

        const seenComm = new Set();
        const comments = [];
        for (const r of commentsRes.records) {
          const taskId = r.get('taskId');
          const taskTitle = r.get('taskTitle');
          const content = r.get('content');
          const createdAt = r.get('createdAt');
          const key = `${taskId}:${content}`;
          if (!seenComm.has(key)) {
            seenComm.add(key);
            comments.push({ taskId, taskTitle, content, createdAt });
          }
        }

        return {
          success: true,
          companyName,
          userName: targetUserName,
          totalTasks: tasks.length,
          tasks,
          totalComments: comments.length,
          recentComments: comments
        };
      }

      case 'get_task_details': {
        const query = (args.query || '').trim();

        const taskCypher = `
          MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
          OPTIONAL MATCH (e)-[:ASSIGNED_TO]->(tAssigned:Task)
          OPTIONAL MATCH (f:Feature)-[:BELONGS_TO]->(o)
          OPTIONAL MATCH (tFeature:Task)-[:PART_OF]->(f)
          WITH coalesce(tAssigned, tFeature) AS t
          WHERE t IS NOT NULL AND (toLower(t.id) = toLower($query) OR toLower(t.title) CONTAINS toLower($query))
          WITH DISTINCT t
          OPTIONAL MATCH (allE:Employee)-[:ASSIGNED_TO]->(t)
          OPTIONAL MATCH (commAuthor:Employee)-[comm:COMMENTED_ON]->(t)
          RETURN t, collect(DISTINCT allE.name) AS assignees,
                 collect(DISTINCT { author: commAuthor.name, content: comm.content, createdAt: comm.createdAt }) AS comments
          LIMIT 1
        `;

        const res = await executeCypherQuery(taskCypher, { companyName, query });
        if (!res.records || res.records.length === 0) {
          return { success: false, error: `No task found matching "${query}" in ${companyName}.` };
        }

        const r = res.records[0];
        const t = r.get('t').properties;
        const assignees = (r.get('assignees') || []).filter(Boolean);
        const rawComments = r.get('comments') || [];
        const seenTaskComm = new Set();
        const comments = [];
        for (const c of rawComments) {
          if (c && c.author && c.content) {
            const key = `${c.author}:${c.content}`;
            if (!seenTaskComm.has(key)) {
              seenTaskComm.add(key);
              comments.push(c);
            }
          }
        }

        return {
          success: true,
          companyName,
          task: {
            id: t.id,
            title: t.title,
            description: t.description || 'No description provided.',
            priority: t.priority || 'P1',
            status: t.status || 'In Progress',
            startDate: t.startDate || 'N/A',
            dueDate: t.dueDate || 'N/A',
            assignees,
            commentsCount: comments.length,
            comments
          }
        };
      }

      case 'search_tasks': {
        const assigneeName = (args.assigneeName || '').trim();
        const status = args.status || null;
        const priority = args.priority || null;
        const query = (args.query || '').trim();

        const cypher = `
          MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
          OPTIONAL MATCH (e)-[:ASSIGNED_TO]->(tAssigned:Task)
          OPTIONAL MATCH (f:Feature)-[:BELONGS_TO]->(o)
          OPTIONAL MATCH (tFeature:Task)-[:PART_OF]->(f)
          WITH coalesce(tAssigned, tFeature) AS t
          WHERE t IS NOT NULL
            AND ($status IS NULL OR t.status = $status)
            AND ($priority IS NULL OR t.priority = $priority)
            AND ($query = '' OR toLower(t.title) CONTAINS toLower($query) OR toLower(t.description) CONTAINS toLower($query))
          WITH DISTINCT t
          OPTIONAL MATCH (allE:Employee)-[:ASSIGNED_TO]->(t)
          OPTIONAL MATCH (commAuthor:Employee)-[comm:COMMENTED_ON]->(t)
          WITH t, collect(DISTINCT allE.name) AS assignees, count(comm) AS commentsCount
          WHERE ($assigneeName = '' OR ANY(name IN assignees WHERE toLower(name) CONTAINS toLower($assigneeName)))
          RETURN t, assignees, commentsCount
          ORDER BY t.createdAt DESC
        `;

        const res = await executeCypherQuery(cypher, {
          companyName,
          assigneeName,
          status,
          priority,
          query
        });

        const tasks = res.records.map((r) => {
          const t = r.get('t').properties;
          const assignees = r.get('assignees') || [];
          const commentsCount = r.get('commentsCount')?.toNumber() || 0;
          return {
            id: t.id,
            title: t.title,
            description: t.description || '',
            priority: t.priority || 'P1',
            status: t.status || 'In Progress',
            startDate: t.startDate || 'N/A',
            dueDate: t.dueDate || 'N/A',
            commentsCount,
            assignees: assignees.filter(Boolean)
          };
        });

        return {
          success: true,
          companyName,
          total: tasks.length,
          tasks
        };
      }

      case 'get_project_summary': {
        const teamCypher = `
          MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
          RETURN count(e) AS teamCount, collect(e.name) AS teamNames
        `;
        const taskCypher = `
          MATCH (e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})
          OPTIONAL MATCH (e)-[:ASSIGNED_TO]->(tAssigned:Task)
          OPTIONAL MATCH (f:Feature)-[:BELONGS_TO]->(o)
          OPTIONAL MATCH (tFeature:Task)-[:PART_OF]->(f)
          WITH coalesce(tAssigned, tFeature) AS t WHERE t IS NOT NULL
          WITH DISTINCT t
          RETURN t.status AS status, count(t) AS count
        `;

        const teamRes = await executeCypherQuery(teamCypher, { companyName });
        const taskRes = await executeCypherQuery(taskCypher, { companyName });

        const teamCount = teamRes.records[0]?.get('teamCount')?.toNumber() || 0;
        const teamNames = teamRes.records[0]?.get('teamNames') || [];

        const statusCounts = {};
        let totalTasks = 0;
        taskRes.records.forEach((r) => {
          const st = r.get('status') || 'Unknown';
          const cnt = r.get('count')?.toNumber() || 0;
          statusCounts[st] = cnt;
          totalTasks += cnt;
        });

        return {
          success: true,
          companyName,
          teamCount,
          teamMembers: teamNames,
          totalTasks,
          statusCounts
        };
      }

      case 'create_task': {
        const { title, description, priority, startDate, dueDate, assignees } = args;
        if (!title || !title.trim()) {
          return { success: false, error: 'Task title is required.' };
        }

        const taskId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
        const cleanAssignees = Array.isArray(assignees) ? assignees : [currentUserName];
        const today = new Date().toISOString().split('T')[0];

        const createTaskCypher = `
          CREATE (t:Task {
            id: $taskId,
            title: $title,
            description: $description,
            priority: $priority,
            startDate: $startDate,
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
          startDate: startDate || today,
          dueDate: dueDate || today
        });

        for (const empName of cleanAssignees) {
          const linkCypher = `
            MATCH (e:Employee {name: $empName}), (t:Task {id: $taskId})
            MERGE (e)-[r:ASSIGNED_TO]->(t)
          `;
          await executeCypherQuery(linkCypher, { empName, taskId });
        }

        return {
          success: true,
          message: `Task ${taskId} ("${title}") created and assigned successfully in CognoDB!`,
          task: {
            id: taskId,
            title: title.trim(),
            description: description || '',
            priority: priority || 'P1',
            status: 'In Progress',
            startDate: startDate || today,
            dueDate: dueDate || today,
            assignees: cleanAssignees
          }
        };
      }

      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  } catch (err) {
    console.error(`AI Tool Error [${toolName}]:`, err);
    return { success: false, error: err.message };
  }
}
