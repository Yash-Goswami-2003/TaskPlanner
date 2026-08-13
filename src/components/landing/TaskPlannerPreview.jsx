'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const samplePreviewTasks = [
  {
    id: 'TASK-919',
    title: 'Create Backend APIs for Wexa Frontend',
    description: 'Design and implement backend APIs for the Wexa frontend, including routing API and user APIs',
    status: 'In Progress',
    priority: 'P1',
    assignees: ['Bob'],
    dueDate: '2026-08-23'
  },
  {
    id: 'TASK-775',
    title: 'Making Frontend for Wexa.ai',
    description: 'Make Frontend for Wexa.ai - landing page - dashboard - authentications',
    status: 'In Progress',
    priority: 'P3',
    assignees: ['Alice', 'Bob'],
    dueDate: '2026-08-13'
  },
  {
    id: 'TASK-715',
    title: 'Force-Directed Graph Visualization Canvas',
    description: 'Render interactive CognoDB multi-hop query graphs using react-force-graph-2d.',
    status: 'To Do',
    priority: 'P2',
    assignees: ['Alice'],
    dueDate: '2026-08-25'
  },
  {
    id: 'TASK-714',
    title: 'Optimize Intent Routing Prompt for Gemini',
    description: 'Refine and optimize the intent-routing system prompt used with Gemini to improve the accuracy, consistency, and reliability...',
    status: 'In Progress',
    priority: 'P1',
    assignees: ['Yash'],
    dueDate: '2026-08-15'
  },
  {
    id: 'TASK-713',
    title: 'Implement OAuth2 Refresh Token Rotation',
    description: 'Add refresh token rotation and revocation logic to CognoDB session store.',
    status: 'In Progress',
    priority: 'P1',
    assignees: ['Admin', 'Yash'],
    dueDate: '2026-08-21'
  }
];

const priorityConfig = {
  P1: { label: 'P1', className: 'bg-red-50 text-red-600 border-red-200' },
  P2: { label: 'P2', className: 'bg-orange-50 text-orange-600 border-orange-200' },
  P3: { label: 'P3', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  P4: { label: 'P4', className: 'bg-zinc-50 text-zinc-500 border-zinc-200' },
};

const statusConfig = {
  'To Do': 'bg-zinc-100 text-zinc-600 border-zinc-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'In Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Done': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const InboxIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
  </svg>
);

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    <path d="M5 3v4" />
    <path d="M3 5h4" />
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function TaskPlannerPreview() {
  const [activeTab, setActiveTab] = useState('all_tasks');

  return (
    <section id="planner-demo" className="px-4 sm:px-6 max-w-6xl mx-auto pb-28">
      {/* Outer Browser Window Replica */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Top App Header (DashboardHeader Replica) */}
        <div className="h-[52px] bg-white border-b border-zinc-100 px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">
                P
              </div>
              <span className="font-semibold text-zinc-900 text-xs tracking-tight">
                Task Planner
              </span>
            </div>
            <div className="w-px h-3.5 bg-zinc-200" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-medium text-zinc-700">Wexa.ai</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1">
              <div className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[9px] font-bold flex items-center justify-center">
                Y
              </div>
              <span className="text-xs font-medium text-zinc-800">Yash</span>
              <span className="text-[9px] font-medium text-zinc-400 bg-zinc-100 px-1 py-0.2 rounded">
                Lead AI Engineer
              </span>
            </div>
            <Link
              href="/login"
              className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 px-2 py-1 rounded-md transition-colors"
            >
              Sign out
            </Link>
          </div>
        </div>

        {/* Dashboard Subheader Replica */}
        <div className="bg-white border-b border-zinc-100 px-6 py-3 shrink-0">
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                Y
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-zinc-900 leading-none">
                  Wexa.ai <span className="text-zinc-400 font-normal">Dashboard</span>
                </h1>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Signed in as <span className="text-zinc-900 font-semibold">Yash</span> · Lead AI Engineer
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] text-zinc-400 font-medium uppercase tracking-widest">Team</div>
              <div className="text-xs font-bold text-zinc-900 leading-snug">4 members</div>
            </div>
          </div>
        </div>

        {/* Workspace Container (Sidebar + Main Task Grid) */}
        <div className="flex flex-1 min-h-[460px]">
          {/* Sidebar Replica */}
          <div className="w-48 bg-white border-r border-zinc-100 flex flex-col justify-between shrink-0 p-3">
            <div>
              <button
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium rounded-lg transition-colors mb-4"
              >
                <PlusIcon />
                Add Member
              </button>

              <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 px-2 mb-1.5">
                Workspace
              </p>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActiveTab('mailbox')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'mailbox' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  <InboxIcon />
                  <span>My Tasks</span>
                </button>
                <button
                  onClick={() => setActiveTab('all_tasks')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'all_tasks' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  <ListIcon />
                  <span>All Tasks</span>
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'team' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  <UsersIcon />
                  <span>Team</span>
                </button>
                <button
                  onClick={() => setActiveTab('ai_plan')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'ai_plan' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SparklesIcon />
                    <span>Plan with AI</span>
                  </div>
                  <span className="text-[8px] font-bold px-1 rounded bg-zinc-200 text-zinc-700">AI</span>
                </button>
              </nav>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-zinc-400 font-medium">CognoDB · Graph</span>
            </div>
          </div>

          {/* Main 2-Column Task Cards Grid Replica */}
          <div className="flex-1 bg-zinc-50/50 flex flex-col">
            {/* Section Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 bg-white shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">
                  {activeTab === 'mailbox' ? 'My Tasks' : activeTab === 'team' ? 'Team Members' : 'All Tasks'}
                </h2>
                <p className="text-[11px] text-zinc-400">Click a task card to open full view</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                  {samplePreviewTasks.length} tasks
                </span>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-xs font-semibold bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors shadow-sm"
                >
                  <PlusIcon />
                  New Task
                </Link>
              </div>
            </div>

            {/* 2-Grid Task Cards */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
                {samplePreviewTasks.map((task) => {
                  const priority = task.priority || 'P1';
                  const pConfig = priorityConfig[priority] || priorityConfig.P1;
                  const status = task.status || 'In Progress';
                  const sStyle = statusConfig[status] || statusConfig['In Progress'];

                  return (
                    <div
                      key={task.id}
                      className="group flex flex-col gap-2.5 p-3.5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 hover:shadow-xs transition-all cursor-pointer"
                    >
                      {/* Top Row: ID, Title, Status, Priority */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[9px] font-mono text-zinc-400 shrink-0 font-semibold">
                            {task.id}
                          </span>
                          <h3 className="text-xs font-semibold text-zinc-900 leading-snug truncate">
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${sStyle}`}>
                            {status}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${pConfig.className}`}>
                            {pConfig.label}
                          </span>
                          <span className="text-zinc-300 group-hover:text-zinc-700 transition-colors ml-0.5">
                            <ArrowRightIcon />
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[10px]">
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            {task.assignees.map((name, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full bg-zinc-900 text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white"
                              >
                                {name[0]}
                              </div>
                            ))}
                          </div>
                          <span className="text-zinc-400 font-medium ml-1">
                            {task.assignees.join(', ')}
                          </span>
                        </div>
                        <span className="text-zinc-400 font-medium">Due {task.dueDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
