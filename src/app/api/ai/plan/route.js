import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getTokenFromRequest, verifyToken } from '../../../../lib/jwt';
import { executeAiTool } from '../../../../lib/aiTools';

// Gemini Function Declarations Schema
const GEMINI_FUNCTION_DECLARATIONS = [
  {
    name: 'search_users',
    description: "Search for team members and employees within the authenticated user's organization.",
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Optional search keyword to match name or role' },
        role: { type: 'STRING', description: 'Optional role filter' }
      }
    }
  },
  {
    name: 'get_user_activity',
    description: "Get detailed activity profile of a specific person in the company: assigned tasks, deadlines, status breakdown, and recent comments posted by them.",
    parameters: {
      type: 'OBJECT',
      properties: {
        userName: { type: 'STRING', description: 'Name of the person to inspect (e.g. Yash, Alice, Admin)' }
      },
      required: ['userName']
    }
  },
  {
    name: 'get_task_details',
    description: "Get full details of a specific task including title, description, dates, priority, status, assignees, and discussion comments stream.",
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Task ID (e.g. TASK-713) or title keyword' }
      },
      required: ['query']
    }
  },
  {
    name: 'search_tasks',
    description: "Search and retrieve tasks within the user's organization graph database by assignee, status, priority, or keyword.",
    parameters: {
      type: 'OBJECT',
      properties: {
        assigneeName: { type: 'STRING', description: 'Filter tasks assigned to user' },
        status: { type: 'STRING', description: 'Filter by status (To Do, In Progress, In Review, Done)' },
        priority: { type: 'STRING', description: 'Filter by priority (P1, P2, P3, P4)' },
        query: { type: 'STRING', description: 'Search keyword matching title or description' }
      }
    }
  },
  {
    name: 'get_project_summary',
    description: "Get high-level executive summary metrics of the organization's project.",
    parameters: {
      type: 'OBJECT',
      properties: {}
    }
  },
  {
    name: 'create_task',
    description: "Create and assign a new task in the organization's graph database.",
    parameters: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'Short title for task' },
        description: { type: 'STRING', description: 'Detailed requirements' },
        priority: { type: 'STRING', description: 'Priority level (P1, P2, P3, P4)' },
        startDate: { type: 'STRING', description: 'Start date YYYY-MM-DD' },
        dueDate: { type: 'STRING', description: 'Due date YYYY-MM-DD' },
        assignees: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'List of assignees'
        }
      },
      required: ['title']
    }
  }
];

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const companyName = decoded.companyName || 'Wexa.ai';
    const userName = decoded.userName || 'Admin';
    const userRole = decoded.role || 'Member';
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const today = new Date().toISOString().split('T')[0];

    const systemInstruction = `You are Task Planner AI, an intelligent, personalized Project Assistant for organization "${companyName}".
You are speaking to "${userName}" (${userRole}). Today's date is ${today}.

Your job is to behave like a calm project lead who knows this workspace personally.

PERSONALIZATION RULES:
- If the user says "my", "me", "I", "what am I doing", or "my tasks", they mean "${userName}". Use get_user_activity for "${userName}".
- If the user asks about a teammate by name, use get_user_activity for that teammate.
- If the user asks "who", "team", "members", or roles, use search_users.
- If the user asks about project status, workload, progress, blockers, overdue, priorities, or active work, use search_tasks or get_project_summary.
- If the user names a task id/title, use get_task_details.
- If the user asks to create/add/assign a task, use create_task. Infer reasonable missing fields from the request, but do not invent extra requirements.

ANSWER STYLE:
- Never mention tools, function names, JSON, keys, database internals, "CognoDB", "Graph Dispatcher", or raw API fields.
- Start with a short personalized line, for example: "Here is what you are working on, ${userName}:" or "Alice is currently focused on:"
- Prefer 2-4 short bullets. Use exact task titles, IDs, status, priority, assignees, start date, and due date when available.
- For user activity, group the answer around what the person is doing now, what is due next, and any recent comment if available.
- For summaries, highlight the most useful status counts or risks, not every raw number.
- If no data is found, say that clearly and suggest a concrete next question.
- Keep the answer polished and human. No debug language. No internal reasoning.`;

    let stepsExecuted = [];

    // =========================================================================
    // 1. Google Gemini 2.5 Flash / 1.5 Flash Model Execution
    // =========================================================================
    if (geminiApiKey && !geminiApiKey.includes('placeholder')) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

        const model = genAI.getGenerativeModel({
          model: geminiModel,
          systemInstruction,
          tools: [{ functionDeclarations: GEMINI_FUNCTION_DECLARATIONS }]
        });

        const chat = model.startChat();
        const lastUserPrompt = messages[messages.length - 1]?.content || '';

        stepsExecuted.push('Understanding your request...');
        let result = await chat.sendMessage(lastUserPrompt);
        let response = result.response;
        let lastToolResult = null;

        let maxLoops = 5;
        while (maxLoops > 0) {
          maxLoops--;
          const calls = response.functionCalls();
          if (calls && calls.length > 0) {
            const call = calls[0];
            const toolName = call.name;
            const args = call.args || {};
            stepsExecuted.push('Checking your workspace data...');

            lastToolResult = await executeAiTool(toolName, args, companyName, userName);

            result = await chat.sendMessage([
              {
                functionResponse: {
                  name: toolName,
                  response: lastToolResult
                }
              }
            ]);
            response = result.response;
          } else {
            break;
          }
        }

        let replyText = '';
        try {
          replyText = response.text();
        } catch (e) { }

        if (!replyText && lastToolResult) {
          if (lastToolResult.tasks) {
            replyText = lastToolResult.tasks.slice(0, 3).map(t => `- **${t.title}** (\`${t.id}\`) | \`${t.status}\` (\`${t.priority}\`) — ${t.startDate} to ${t.dueDate}; assigned to ${t.assignees.join(', ') || 'Unassigned'}.`).join('\n');
          } else {
            replyText = 'I found the workspace data, but could not format it cleanly. Try asking about a specific person, task, or project status.';
          }
        }

        if (replyText) {
          // Hard cap: keep only the first 3-4 non-empty lines
          replyText = replyText
            .split('\n')
            .filter((l) => l.trim().length > 0)
            .slice(0, 5)
            .join('\n');

          return NextResponse.json({
            success: true,
            engine: `Google Gemini (${geminiModel})`,
            reply: replyText,
            steps: stepsExecuted
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API execution error, switching to direct graph dispatcher:', geminiError.message);
      }
    }

    // =========================================================================
    // 2. Direct Graph Tool Dispatcher (Used when key is demo placeholder)
    // =========================================================================
    const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
    let fallbackTool = 'search_tasks';
    let fallbackArgs = {};

    const nameMatch = lastMsg.match(/yash|alice|bob|admin|marcus|sarah|elena|ken/i);
    const asksAboutSelf = /\b(my|me|i|mine)\b/.test(lastMsg) || lastMsg.includes('what am i doing');
    if (asksAboutSelf) {
      fallbackTool = 'get_user_activity';
      fallbackArgs = { userName };
    } else if (nameMatch) {
      fallbackTool = 'get_user_activity';
      fallbackArgs = { userName: nameMatch[0] };
    } else if (lastMsg.includes('user') || lastMsg.includes('team') || lastMsg.includes('who')) {
      fallbackTool = 'search_users';
    } else if (lastMsg.includes('in progress')) {
      fallbackTool = 'search_tasks';
      fallbackArgs = { status: 'In Progress' };
    } else if (lastMsg.includes('to do')) {
      fallbackTool = 'search_tasks';
      fallbackArgs = { status: 'To Do' };
    } else if (lastMsg.includes('review')) {
      fallbackTool = 'search_tasks';
      fallbackArgs = { status: 'In Review' };
    } else if (lastMsg.includes('done') || lastMsg.includes('completed')) {
      fallbackTool = 'search_tasks';
      fallbackArgs = { status: 'Done' };
    } else if (lastMsg.includes('summary') || lastMsg.includes('progress') || lastMsg.includes('status')) {
      fallbackTool = 'get_project_summary';
    } else if (lastMsg.includes('create') || lastMsg.includes('add task')) {
      fallbackTool = 'create_task';
      fallbackArgs = { title: 'AI Generated Task', assignees: [userName] };
    } else if (lastMsg.includes('task-') || lastMsg.includes('comment')) {
      const taskMatch = lastMsg.match(/task-\d+/i);
      fallbackTool = 'get_task_details';
      fallbackArgs = { query: taskMatch ? taskMatch[0] : lastMsg };
    }

    stepsExecuted.push('Checking your workspace data...');
    const toolResult = await executeAiTool(fallbackTool, fallbackArgs, companyName, userName);

    let replyText = '';
    if (fallbackTool === 'get_user_activity') {
      const taskLines = (toolResult.tasks || [])
        .slice(0, 4)
        .map((t) => `- **${t.title}** (\`${t.id}\`) | \`${t.status}\` (\`${t.priority}\`) — ${t.startDate} to ${t.dueDate}.`)
        .join('\n');
      const commentLine = toolResult.recentComments?.length
        ? `\n- Recent update: "${toolResult.recentComments[0].content}" on **${toolResult.recentComments[0].taskTitle}**.`
        : '';
      replyText = `${toolResult.userName} is currently assigned to ${toolResult.totalTasks || 0} task${toolResult.totalTasks === 1 ? '' : 's'}.\n${taskLines || '- No active assigned tasks found right now.'}${commentLine}`;
    } else if (fallbackTool === 'get_project_summary') {
      const statusLine = Object.entries(toolResult.statusCounts || {})
        .map(([status, count]) => `${status}: ${count}`)
        .join(', ');
      replyText = `Here is the current ${companyName} project snapshot:\n- **${toolResult.totalTasks || 0} tasks** across **${toolResult.teamCount || 0} team members**.\n- Status breakdown: ${statusLine || 'No task status data found'}.\n- Team: ${(toolResult.teamMembers || []).join(', ') || 'No members found'}.`;
    } else if (fallbackTool === 'search_users') {
      const users = toolResult.users || [];
      replyText = users.length
        ? `Here is the ${companyName} team:\n${users.slice(0, 6).map((member) => `- **${member.name}** — ${member.role || 'Member'}`).join('\n')}`
        : `I could not find team members for ${companyName}.`;
    } else if (fallbackTool === 'get_task_details' && toolResult.task) {
      const task = toolResult.task;
      replyText = `Here is the task detail:\n- **${task.title}** (\`${task.id}\`) | \`${task.status}\` (\`${task.priority}\`) — ${task.startDate} to ${task.dueDate}.\n- Assigned to: ${task.assignees?.join(', ') || 'Unassigned'}.\n- ${task.description || 'No description added yet.'}`;
    } else if (fallbackTool === 'create_task' && toolResult.task) {
      const task = toolResult.task;
      replyText = `Done, I created **${task.title}** (\`${task.id}\`).\n- Priority: \`${task.priority}\`; status: \`${task.status}\`.\n- Assigned to ${task.assignees?.join(', ') || userName}, due ${task.dueDate}.`;
    } else if (fallbackTool === 'search_tasks') {
      const tasks = toolResult.tasks || [];
      replyText = tasks.length
        ? `Here are the most relevant tasks:\n${tasks.slice(0, 4).map((t) => `- **${t.title}** (\`${t.id}\`) | \`${t.status}\` (\`${t.priority}\`) — assigned to ${t.assignees?.join(', ') || 'Unassigned'}, due ${t.dueDate}.`).join('\n')}`
        : 'I could not find matching tasks in this workspace.';
    } else {
      replyText = toolResult.error || 'I could not find enough workspace data to answer that cleanly.';
    }

    return NextResponse.json({
      success: true,
      engine: 'Graph Tool Dispatcher',
      reply: replyText,
      steps: stepsExecuted
    });
  } catch (error) {
    console.error('AI Plan API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error executing AI plan request.' },
      { status: 500 }
    );
  }
}
