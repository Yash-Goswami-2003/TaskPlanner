'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCT_NAME } from '../../lib/constants';

export default function DashboardHeader({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('task_planner_token');
    localStorage.removeItem('task_planner_user');
    document.cookie = 'task_planner_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <header className="h-[56px] bg-white border-b border-zinc-100 px-5 flex items-center justify-between shrink-0">
      {/* Brand & Organization */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-semibold text-xs group-hover:bg-zinc-700 transition-colors">
            P
          </div>
          <span className="font-semibold text-zinc-900 text-sm tracking-tight hidden sm:inline">
            {PRODUCT_NAME}
          </span>
        </Link>

        <div className="w-px h-4 bg-zinc-200 hidden sm:block" />

        {/* Company Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-medium text-zinc-700">{user?.companyName || 'Acme Tech'}</span>
        </div>
      </div>

      {/* Right — User + Logout */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors cursor-default">
          <div className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {(user?.userName || 'A').substring(0, 1).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-zinc-800 hidden sm:inline">{user?.userName || 'Admin'}</span>
          <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded hidden sm:inline">
            {user?.role || 'Admin'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 px-2.5 py-1.5 rounded-md transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
