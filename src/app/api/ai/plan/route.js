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
    const geminiApiKey = process.env.GEMINI_API_KEY;

    const systemInstruction = `You are Task Planner AI, an intelligent project manager and conversational graph database assistant for organization "${companyName}".
Authenticated User: "${userName}" (Role: ${decoded.role || 'Member'}).

PERSONALIZED RESPONSE GUIDELINES:
1. Always present tasks using their FULL TASK TITLE alongside the ID (e.g., "**Implement OAuth2 Refresh Token Rotation** (\`TASK-713\`)").
2. Always specify exact **Start Date** and **Due Date / Deadline** for tasks.
3. When asked about a specific person (e.g., "What is Yash doing?", "Has Alice commented?"), call \`get_user_activity\` or \`search_tasks\` to detail:
   - What tasks they are actively working on (\`In Progress\`, \`In Review\`, \`Done\`).
   - Their exact due dates and deadlines.
   - Any discussion comments they posted on tasks (including comment content and context).
4. When asked about a specific task, use \`get_task_details\` to output its description and complete discussion comment stream.`;

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

        stepsExecuted.push(`Gemini API: Generating intent analysis using ${geminiModel}...`);
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
            stepsExecuted.push(`Gemini Tool Call: ${toolName}(${JSON.stringify(args)})`);

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
        } catch (e) {}

        if (!replyText && lastToolResult) {
          if (lastToolResult.tasks) {
            replyText = `### ${companyName} Graph Insights\n\nFound **${lastToolResult.tasks.length}** tasks in CognoDB:\n\n` +
              lastToolResult.tasks.map(t => `- **${t.title}** (\`${t.id}\`) [\`${t.status}\`] (\`${t.priority}\`) — Assigned: ${t.assignees.join(', ') || 'Unassigned'}, Due: \`${t.dueDate}\``).join('\n');
          } else {
            replyText = `### ${companyName} Graph Insights\n\n` + JSON.stringify(lastToolResult, null, 2);
          }
        }

        if (replyText) {
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
    if (nameMatch) {
      fallbackTool = 'get_user_activity';
      fallbackArgs = { userName: nameMatch[0] };
    } else if (lastMsg.includes('user') || lastMsg.includes('team') || lastMsg.includes('who')) {
      fallbackTool = 'search_users';
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

    stepsExecuted.push(`Graph Tool Execution: ${fallbackTool}(${JSON.stringify(fallbackArgs)})`);
    const toolResult = await executeAiTool(fallbackTool, fallbackArgs, companyName, userName);

    let replyText = '';
    if (fallbackTool === 'get_user_activity') {
      replyText = `### Activity Profile for **${toolResult.userName}** (${companyName})\n\n- **Assigned Tasks**: \`${toolResult.totalTasks}\` active tasks\n- **Discussion Comments**: \`${toolResult.totalComments}\` comments posted\n\n#### Active Work & Deadlines:\n${toolResult.tasks
        .map((t) => `- **${t.title}** (\`${t.id}\`) [\`${t.status}\`] (\`${t.priority}\`) — Due: \`${t.dueDate}\``)
        .join('\n')}\n\n#### Recent Comments:\n${toolResult.recentComments.length ? toolResult.recentComments.map((c) => `- *"${c.content}"* on **${c.taskTitle}** (\`${c.taskId}\`)`).join('\n') : '_No recent comments posted._'}`;
    } else if (fallbackTool === 'get_project_summary') {
      replyText = `### ${companyName} Executive Project Summary\n\n- **Total Active Tasks**: \`${toolResult.totalTasks}\`\n- **Team Count**: \`${toolResult.teamCount}\` members (${toolResult.teamMembers.join(', ')})\n\n#### Status Breakdown:\n${Object.entries(toolResult.statusCounts)
        .map(([st, count]) => `- **${st}**: \`${count}\``)
        .join('\n')}\n\n*Retrieved live from CognoDB graph.*`;
    } else {
      replyText = `### ${companyName} Graph Insights\n\n- **Organization**: \`${companyName}\`\n- **Query Tool Executed**: \`${fallbackTool}\`\n- **Total Records Found**: \`${toolResult.total || toolResult.totalTasks || 1}\`\n\n*All responses are generated dynamically from authorized CognoDB graph queries.*`;
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
