'use client';

import React from 'react';

export default function DashboardSidebar({
  user,
  activeView,
  onViewChange,
  onOpenCreateTask,
  onOpenCreateEmployee
}) {
  return (
    <aside className="w-64 bg-neutral-50 border-r border-neutral-200 flex flex-col justify-between p-4 h-[calc(100vh-65px)] sticky top-[65px]">
      {/* Top Section */}
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-white border border-neutral-200 rounded-xl shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
              {(user?.userName || 'A').substring(0, 1).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-xs text-neutral-900 truncate">
                {user?.userName || 'Admin'}
              </div>
              <div className="text-[11px] text-neutral-500 truncate">
                {user?.role || 'Admin'} • {user?.companyName || 'Acme'}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="space-y-2">
          <button
            onClick={onOpenCreateTask}
            className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span className="text-base leading-none">+</span>
            <span>Create New Task</span>
          </button>

          {user?.role === 'Admin' && (
            <button
              onClick={onOpenCreateEmployee}
              className="w-full py-2 px-3 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>+ Create Employee</span>
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2 block mb-1">
            Workspaces
          </span>

          <button
            onClick={() => onViewChange('mailbox')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeView === 'mailbox'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>📥</span>
              <span>Mailbox (My Tasks)</span>
            </div>
          </button>

          <button
            onClick={() => onViewChange('all_tasks')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeView === 'all_tasks'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>📋</span>
              <span>All Org Tasks</span>
            </div>
          </button>

          <button
            onClick={() => onViewChange('team')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeView === 'team'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>Team Members</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-neutral-200 text-[11px] text-neutral-400 text-center">
        CognoDB Graph Database • Connected
      </div>
    </aside>
  );
}
