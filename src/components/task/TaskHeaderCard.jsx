'use client';

import React from 'react';

export default function TaskHeaderCard({ task, onDueDateChange }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-400 font-bold uppercase tracking-wider">
            {task.id}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-neutral-900 text-white">
            {task.priority || 'P1'}
          </span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-800">
            {task.status || 'In Progress'}
          </span>
        </div>

        {/* Calendar Scheduler Input */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-neutral-700">Scheduler / Calendar:</span>
          <input
            type="date"
            value={task.dueDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:border-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Header Task Name */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
        {task.title}
      </h1>
    </div>
  );
}
