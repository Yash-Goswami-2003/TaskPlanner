'use client';

import React from 'react';

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

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function DashboardSidebar({
  user,
  activeView,
  onViewChange,
  onOpenCreateTask,
  onOpenCreateEmployee
}) {
  const navItems = [
    { id: 'mailbox', label: 'My Tasks', icon: <InboxIcon /> },
    { id: 'all_tasks', label: 'All Tasks', icon: <ListIcon /> },
    { id: 'team', label: 'Team', icon: <UsersIcon /> },
  ];

  return (
    <aside className="w-56 bg-white border-r border-zinc-100 flex flex-col h-[calc(100vh-56px)] sticky top-[56px]">
      {/* User identity block */}
      <div className="px-4 pt-5 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {(user?.userName || 'A').substring(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-zinc-900 truncate">{user?.userName || 'Admin'}</div>
            <div className="text-[11px] text-zinc-400 truncate">{user?.role || 'Admin'}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-3 pt-4 space-y-1.5">
        <button
          onClick={onOpenCreateTask}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors active:scale-[0.98]"
        >
          <PlusIcon />
          New Task
        </button>

        {user?.role === 'Admin' && (
          <button
            onClick={onOpenCreateEmployee}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium rounded-lg transition-colors"
          >
            <PlusIcon />
            Add Member
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="px-3 mt-6 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-2 mb-2">Workspace</p>
        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeView === item.id
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <span className={activeView === item.id ? 'text-white' : 'text-zinc-400'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-zinc-100">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-400 font-medium">CognoDB · Graph</span>
        </div>
      </div>
    </aside>
  );
}
