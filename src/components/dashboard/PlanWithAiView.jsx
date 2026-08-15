'use client';

import React, { useState, useRef, useEffect } from 'react';

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
  </svg>
);

const presetPrompts = [
  'What am I working on?',
  'Summarize project status and team workload',
  'What is Yash doing this week?',
  'Create a P1 task to optimize API performance assigned to Yash'
];

function renderSimpleMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  return lines.map((line, idx) => {
    if (line.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-sm font-bold text-zinc-900 mt-3 mb-1.5 leading-snug">
          {line.replace('### ', '')}
        </h3>
      );
    }
    if (line.startsWith('#### ')) {
      return (
        <h4 key={idx} className="text-xs font-semibold text-zinc-800 mt-2 mb-1">
          {line.replace('#### ', '')}
        </h4>
      );
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.substring(2);
      return (
        <li key={idx} className="ml-4 list-disc text-xs text-zinc-700 leading-relaxed mb-1">
          {formatInlineStyles(content)}
        </li>
      );
    }
    if (line.trim() === '') {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="text-xs text-zinc-700 leading-relaxed mb-1">
        {formatInlineStyles(line)}
      </p>
    );
  });
}

function formatInlineStyles(text) {
  const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[11px] font-semibold bg-zinc-100 border border-zinc-200 text-zinc-800 px-1.5 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function PlanWithAiView({ user, onTaskCreated }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello **${user?.userName || 'Admin'}**. I can help you understand your tasks, check teammate activity, summarize project progress, or create new work for **${user?.companyName || 'Wexa.ai'}**.\n\nWhat would you like to plan today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, currentSteps]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', content: query.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);
    setCurrentSteps(['Understanding your request...']);

    try {
      const token = localStorage.getItem('task_planner_token');
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (res.ok && data.success && (data.reply || data.steps?.length)) {
        if (data.steps && data.steps.length > 0) {
          setCurrentSteps(data.steps);
        }
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || 'I finished checking the workspace, but could not format a useful answer.' }
        ]);

        if (onTaskCreated && (query.toLowerCase().includes('create') || query.toLowerCase().includes('add task'))) {
          onTaskCreated();
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.error || 'I could not process that request. Please try a more specific person, task, or status question.' }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please check your internet or retry.' }
      ]);
    } finally {
      setIsLoading(false);
      setCurrentSteps([]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50/50">
      {/* Section Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-zinc-100 bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
            <SparklesIcon />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Plan with AI</h2>
            <p className="text-[11px] text-zinc-400">Personal workspace assistant for tasks, teammates, and planning</p>
          </div>
        </div>

      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {msg.role === 'user' ? 'You' : 'Task Planner AI'}
              </span>
            </div>

            <div
              className={`max-w-2xl p-4 rounded-xl text-xs leading-relaxed ${msg.role === 'user'
                  ? 'bg-zinc-900 text-white rounded-br-none shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none shadow-2xs'
                }`}
            >
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div>{renderSimpleMarkdown(msg.content)}</div>
              )}
            </div>

          </div>
        ))}

        {/* Loading Spinner with Live Steps Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start space-y-1.5 animate-pulse">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Task Planner AI
            </span>
            <div className="p-4 bg-white border border-zinc-200 rounded-xl rounded-bl-none text-xs text-zinc-500 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Generating response...</span>
            </div>
            {currentSteps.map((st, i) => (
              <span key={i} className="text-[9px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                {st}
              </span>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Prompt Chips & Input Bar */}
      <div className="p-6 bg-white border-t border-zinc-100 max-w-4xl mx-auto w-full shrink-0 space-y-3">
        {/* Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {presetPrompts.map((chip, cIdx) => (
            <button
              key={cIdx}
              onClick={() => handleSendMessage(chip)}
              className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about tasks, team members, or tell AI to create a task..."
            className="flex-1 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg transition-colors active:scale-[0.98] disabled:opacity-40 shrink-0"
          >
            <SendIcon />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
