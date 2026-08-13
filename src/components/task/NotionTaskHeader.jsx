'use client';

import React from 'react';

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const StatusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const statusConfig = {
  'To Do': { label: 'To Do', className: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
  'In Progress': { label: 'In Progress', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  'In Review': { label: 'In Review', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Done': { label: 'Done', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const priorityConfig = {
  P1: { label: 'P1 · High', className: 'bg-red-50 text-red-700 border-red-200' },
  P2: { label: 'P2 · Medium', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  P3: { label: 'P3 · Low', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  P4: { label: 'P4 · Low', className: 'bg-zinc-50 text-zinc-500 border-zinc-200' },
};

export default function NotionTaskHeader({
  task,
  onStatusChange,
  onPriorityChange,
  onStartDateChange,
  onDueDateChange
}) {
  const currentStatus = task.status || 'In Progress';
  const currentPriority = task.priority || 'P1';

  return (
    <div className="space-y-6 pb-6 border-b border-zinc-100">
      {/* Task ID & Document badge */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">
          {task.id}
        </span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
        {task.title}
      </h1>

      {/* Property Rows Grid */}
      <div className="space-y-3 text-xs max-w-xl pt-1">
        {/* Status Property */}
        <div className="flex items-center gap-4">
          <span className="w-28 font-medium text-zinc-400 flex items-center gap-2 shrink-0">
            <StatusIcon /> Status
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.keys(statusConfig).map((st) => {
              const isActive = currentStatus === st;
              const cfg = statusConfig[st];
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange && onStatusChange(st)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                    isActive
                      ? cfg.className
                      : 'bg-white text-zinc-400 border-zinc-200 hover:text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Property */}
        <div className="flex items-center gap-4">
          <span className="w-28 font-medium text-zinc-400 flex items-center gap-2 shrink-0">
            <TagIcon /> Priority
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.keys(priorityConfig).map((pr) => {
              const isActive = currentPriority === pr;
              const cfg = priorityConfig[pr];
              return (
                <button
                  key={pr}
                  type="button"
                  onClick={() => onPriorityChange && onPriorityChange(pr)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                    isActive
                      ? cfg.className
                      : 'bg-white text-zinc-400 border-zinc-200 hover:text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {pr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Date */}
        <div className="flex items-center gap-4">
          <span className="w-28 font-medium text-zinc-400 flex items-center gap-2 shrink-0">
            <CalendarIcon /> Start Date
          </span>
          <input
            type="date"
            value={task.startDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => onStartDateChange && onStartDateChange(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 hover:bg-white px-2.5 py-1 rounded-md text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-900 transition cursor-pointer"
          />
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-4">
          <span className="w-28 font-medium text-zinc-400 flex items-center gap-2 shrink-0">
            <CalendarIcon /> Due Date
          </span>
          <input
            type="date"
            value={task.dueDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => onDueDateChange && onDueDateChange(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 hover:bg-white px-2.5 py-1 rounded-md text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-900 transition cursor-pointer"
          />
        </div>

        {/* Assign To */}
        <div className="flex items-center gap-4">
          <span className="w-28 font-medium text-zinc-400 flex items-center gap-2 shrink-0">
            <UserIcon /> Assignees
          </span>
          <div className="flex flex-wrap gap-2">
            {(task.assignees || ['Admin']).map((empName, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-zinc-800 font-semibold text-xs bg-zinc-100 px-2 py-0.5 rounded-md"
              >
                <span className="w-4 h-4 rounded-full bg-zinc-900 text-white text-[9px] font-bold flex items-center justify-center">
                  {empName.substring(0, 1).toUpperCase()}
                </span>
                {empName}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
