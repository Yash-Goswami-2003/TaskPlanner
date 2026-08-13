import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getTokenFromRequest, verifyToken } from '../../../../lib/jwt';
import { AI_TOOLS_DEFINITIONS, executeAiTool } from '../../../../lib/aiTools';

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured in .env.local.' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    const systemMessage = {
      role: 'system',
      content: `You are Task Planner AI, an intelligent project manager and conversational graph database assistant for organization "${companyName}".
Authenticated User: "${userName}" (Role: ${decoded.role || 'Member'}).

PERSONALIZED RESPONSE GUIDELINES:
1. Always present tasks using their FULL TASK TITLE alongside the ID (e.g., "**Implement OAuth2 Refresh Token Rotation** (\`TASK-713\`)").
2. Always specify exact **Start Date** and **Due Date / Deadline** for tasks.
3. When asked about a specific person (e.g., "What is Yash doing?", "Has Alice commented?"), call \`get_user_activity\` or \`search_tasks\` to detail:
   - What tasks they are actively working on (\`In Progress\`, \`In Review\`, \`Done\`).
   - Their exact due dates and deadlines.
   - Any discussion comments they posted on tasks (including comment content and context).
4. When asked about a specific task, use \`get_task_details\` to output its description and complete discussion comment stream.

CRITICAL FUNCTION CALLING RULES:
1. When invoking a tool, output ONLY the clean tool name in the function name field (e.g. "get_user_activity"). NEVER append JSON parameters inside the function name.
2. You MUST call available backend tools (get_user_activity, get_task_details, search_tasks, search_users, get_project_summary, create_task) to fetch real, authorized graph database records from CognoDB before answering questions.`
    };

    let conversation = [systemMessage, ...messages.map((m) => ({ role: m.role, content: m.content }))];
    let stepsExecuted = [];
    let loopCount = 0;
    const maxLoops = 5;

    while (loopCount < maxLoops) {
      loopCount++;

      let responseMessage;
      try {
        const completion = await groq.chat.completions.create({
          messages: conversation,
          model: model,
          tools: AI_TOOLS_DEFINITIONS,
          tool_choice: 'auto',
          temperature: 0.2
        });
        responseMessage = completion.choices[0]?.message;
      } catch (groqErr) {
        console.warn('Groq function calling error:', groqErr.message);

        // Fallback: If model function calling formatting fails, execute fallback intent routing directly
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

        stepsExecuted.push(`Groq Tool Call (Sanitized): ${fallbackTool}(${JSON.stringify(fallbackArgs)})`);
        const toolResult = await executeAiTool(fallbackTool, fallbackArgs, companyName, userName);

        // Ask Groq to synthesize the final markdown response from tool data without tools parameter
        const synthesisCompletion = await groq.chat.completions.create({
          messages: [
            systemMessage,
            {
              role: 'user',
              content: `User Question: "${lastMsg}"\n\nRetrieved Graph Database Data:\n${JSON.stringify(toolResult, null, 2)}\n\nPlease synthesize a concise, beautifully formatted GitHub Markdown response answering the user's question.`
            }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.3
        });

        const synthMessage = synthesisCompletion.choices[0]?.message?.content || 'Completed data synthesis.';

        return NextResponse.json({
          success: true,
          reply: synthMessage,
          steps: stepsExecuted
        });
      }

      if (!responseMessage) break;

      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        conversation.push(responseMessage);

        for (const toolCall of responseMessage.tool_calls) {
          let rawName = toolCall.function.name || '';
          let toolName = rawName;
          let args = {};

          // Sanitize function name if model concatenates JSON string into function name
          if (rawName.includes('{') || rawName.includes(' ')) {
            const spaceIdx = rawName.indexOf(' ');
            const braceIdx = rawName.indexOf('{');
            const splitIdx =
              spaceIdx !== -1 && braceIdx !== -1
                ? Math.min(spaceIdx, braceIdx)
                : spaceIdx !== -1
                ? spaceIdx
                : braceIdx;

            if (splitIdx !== -1) {
              toolName = rawName.substring(0, splitIdx).trim();
              const jsonPart = rawName.substring(splitIdx).trim();
              try {
                args = JSON.parse(jsonPart);
              } catch (e) {}
            }
          }

          if (Object.keys(args).length === 0) {
            try {
              args = JSON.parse(toolCall.function.arguments || '{}');
            } catch (e) {}
          }

          stepsExecuted.push(`Groq Tool Call: ${toolName}(${JSON.stringify(args)})`);
          const toolResult = await executeAiTool(toolName, args, companyName, userName);

          conversation.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          });
        }
      } else {
        // AI generated final response
        return NextResponse.json({
          success: true,
          reply: responseMessage.content,
          steps: stepsExecuted
        });
      }
    }

    return NextResponse.json({
      success: true,
      reply: 'Task Planner AI completed request processing.',
      steps: stepsExecuted
    });
  } catch (error) {
    console.error('Groq AI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error executing Groq AI request.' },
      { status: 500 }
    );
  }
}
