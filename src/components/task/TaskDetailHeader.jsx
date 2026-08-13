'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export default function TaskDetailHeader({ taskId, taskTitle, user, onDeleteTask, isDeleting }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    onDeleteTask();
  };

  return (
    <>
      <header className="h-[56px] bg-white border-b border-zinc-100 px-5 flex items-center justify-between sticky top-0 z-40">
        {/* Back Button & Breadcrumb */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <ChevronLeftIcon />
            <span>Dashboard</span>
          </Link>
          <span className="text-zinc-300">/</span>
          <span className="font-mono text-xs font-semibold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
            {taskId}
          </span>
        </div>

        {/* Actions & User Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
            className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <TrashIcon />
            <span>{isDeleting ? 'Deleting...' : 'Delete Task'}</span>
          </button>

          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
            <div className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[9px] font-bold flex items-center justify-center">
              {(user?.userName || 'A').substring(0, 1).toUpperCase()}
            </div>
            <span className="font-medium text-zinc-800 hidden sm:inline">{user?.userName || 'User'}</span>
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        taskId={taskId}
        taskTitle={taskTitle}
        isDeleting={isDeleting}
      />
    </>
  );
}
