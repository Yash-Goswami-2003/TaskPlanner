'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

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

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const InboxEmptyIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
  </svg>
);

function TaskCard({ task, onClick }) {
  const priority = task.priority || 'P1';
  const pConfig = priorityConfig[priority] || priorityConfig.P1;
  const status = task.status || 'In Progress';
  const sStyle = statusConfig[status] || statusConfig['In Progress'];

  return (
    <div
      onClick={onClick}
      className="group flex flex-col gap-3 p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 hover:shadow-sm transition-all cursor-pointer"
    >
      {/* Top row — ID, title, status, priority, arrow */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[10px] font-mono text-zinc-400 shrink-0 font-semibold">
            {task.id}
          </span>
          <h3 className="text-sm font-semibold text-zinc-900 leading-snug truncate">
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${sStyle}`}>
            {status}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${pConfig.className}`}>
            {pConfig.label}
          </span>
          <span className="text-zinc-300 group-hover:text-zinc-700 transition-colors ml-1">
            <ArrowRightIcon />
          </span>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Bottom row — assignees + due date */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {(task.assignees?.length ? task.assignees.slice(0, 3) : ['?']).map((name, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
                title={name}
              >
                {name.substring(0, 1).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-zinc-400 font-medium">
            {task.assignees?.length
              ? task.assignees.slice(0, 2).join(', ') + (task.assignees.length > 2 ? ` +${task.assignees.length - 2}` : '')
              : 'Unassigned'}
          </span>
        </div>
        <span className="text-zinc-400 font-medium">Due {task.dueDate || 'Next Sprint'}</span>
      </div>
    </div>
  );
}

export default function MailboxTaskList({
  tasks = [],
  viewTitle = 'Mailbox',
  onOpenCreateTask
}) {
  const router = useRouter();

  const handleTaskClick = (task) => {
    router.push(`/task/${task.id}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Section header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 bg-white sticky top-[56px] z-10">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">{viewTitle}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Click a task to open the full view</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-md">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
          <button
            onClick={onOpenCreateTask}
            className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-700 text-white px-3.5 py-2 rounded-lg transition-colors active:scale-[0.97] shadow-sm"
          >
            <PlusIcon />
            New Task
          </button>
        </div>
      </div>

      {/* Task list / Empty state */}
      <div className="flex-1 px-8 py-6">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center">
            <div className="mb-4 opacity-60">
              <InboxEmptyIcon />
            </div>
            <h4 className="text-sm font-semibold text-zinc-700 mb-1">Nothing here yet</h4>
            <p className="text-xs text-zinc-400 max-w-[240px] mb-5 leading-relaxed">
              Your workspace is empty. Create your first task to get started.
            </p>
            <button
              onClick={onOpenCreateTask}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white px-3.5 py-2 rounded-lg transition-colors shadow-sm"
            >
              <PlusIcon />
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
