'use client';

import React from 'react';
import Link from 'next/link';

export default function TaskDetailHeader({ taskId, user, onDeleteTask, isDeleting }) {
  return (
    <header className="h-[60px] bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition"
        >
          <span>←</span>
          <span>Dashboard</span>
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
          {taskId}
        </span>
      </div>

      {/* Actions & User Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onDeleteTask}
          disabled={isDeleting}
          className="text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete Task'}
        </button>

        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-lg text-xs">
          <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
            {(user?.userName || 'A').substring(0, 1).toUpperCase()}
          </span>
          <span className="font-medium text-neutral-800">{user?.userName || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
