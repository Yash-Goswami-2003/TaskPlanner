'use client';

import React from 'react';

export default function NotionTaskHeader({ task, onDueDateChange }) {
  return (
    <div className="space-y-6 pb-6 border-b border-neutral-200">
      {/* Icon & ID */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">📄</span>
        <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest">
          {task.id}
        </span>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
        {task.title}
      </h1>

      {/* Notion Property Rows (Unboxed, Pure Lines) */}
      <div className="space-y-2.5 text-xs max-w-lg pt-1">
        {/* Scheduler */}
        <div className="flex items-center gap-4">
          <span className="w-28 font-medium text-neutral-400 flex items-center gap-1.5 shrink-0">
            <span>📅</span> Scheduler
          </span>
          <input
            type="date"
            value={task.dueDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="bg-transparent hover:bg-neutral-100 px-2 py-1 rounded text-xs font-mono text-neutral-900 focus:outline-none transition cursor-pointer"
          />
        </div>

        {/* Priority */}
        <div className="flex items-center gap-4">
          <span className="w-28 font-medium text-neutral-400 flex items-center gap-1.5 shrink-0">
            <span>🏷️</span> Priority
          </span>
          <span className="font-semibold text-neutral-900 font-mono text-xs">
            {task.priority || 'P1'}
          </span>
        </div>

        {/* Assign To */}
        <div className="flex items-center gap-4">
          <span className="w-28 font-medium text-neutral-400 flex items-center gap-1.5 shrink-0">
            <span>👤</span> Assign To
          </span>
          <div className="flex flex-wrap gap-2">
            {(task.assignees || ['Admin']).map((empName, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-neutral-900 font-semibold text-xs"
              >
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] font-bold flex items-center justify-center">
                  {empName.substring(0, 1).toUpperCase()}
                </span>
                {empName}
                {i < (task.assignees?.length || 1) - 1 && <span className="text-neutral-300 font-normal">,</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
