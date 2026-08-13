'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function MailboxTaskList({
  tasks = [],
  viewTitle = "Mailbox",
  onOpenCreateTask
}) {
  const router = useRouter();

  const handleTaskClick = (task) => {
    router.push(`/task/${task.id}`);
  };

  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 bg-white max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">{viewTitle}</h2>
          <p className="text-xs text-neutral-500">Click any task card to open its dedicated view & discussion</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold bg-neutral-100 border border-neutral-200 text-neutral-800 px-3 py-1.5 rounded-lg">
            {tasks.length} tasks
          </span>
          <button
            onClick={onOpenCreateTask}
            className="text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl transition shadow-2xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <span>+ Create New Task</span>
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-neutral-400 my-auto border border-dashed border-neutral-200 rounded-3xl bg-neutral-50/50">
          <span className="text-4xl mb-3">📥</span>
          <h4 className="text-base font-bold text-neutral-800 mb-1">No Active Tasks</h4>
          <p className="text-xs text-neutral-500 max-w-xs mb-6">
            Your workspace is clean! Click below to create your first real task in CognoDB.
          </p>
          <button
            onClick={onOpenCreateTask}
            className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            + Create First Task
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-neutral-400 font-bold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                    {task.id}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-900 leading-snug">
                    {task.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-neutral-900 text-white">
                    {task.priority || 'P1'}
                  </span>
                  <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-900 transition">
                    View Task →
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 mb-4 line-clamp-2">
                {task.description || <span className="italic text-neutral-400">No description provided. Click to add...</span>}
              </p>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-800">
                    Assigned: {task.assignees?.length ? task.assignees.join(', ') : 'Unassigned'}
                  </span>
                </div>
                <span className="font-mono text-neutral-400">Due: {task.dueDate || 'Tomorrow'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
