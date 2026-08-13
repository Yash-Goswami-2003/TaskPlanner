'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCT_NAME } from '../../lib/constants';

export default function DashboardHeader({ user, onOpenCreateEmployee }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('task_planner_token');
    localStorage.removeItem('task_planner_user');
    document.cookie = 'task_planner_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Organization */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center text-white font-bold text-sm shadow-2xs group-hover:bg-neutral-800 transition">
              T
            </div>
            <span className="font-bold text-neutral-900 text-base tracking-tight hidden sm:inline">
              {PRODUCT_NAME}
            </span>
          </Link>

          <span className="text-neutral-300 hidden sm:inline">•</span>

          {/* Org Badge */}
          <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-lg text-xs">
            <span className="font-semibold text-neutral-900">{user?.companyName || 'Acme Tech'}</span>
            <span className="text-neutral-400 font-mono text-[10px] uppercase">CognoDB</span>
          </div>
        </div>

        {/* User Badge & Actions */}
        <div className="flex items-center gap-3">
          {/* Create Employee Button (Visible for Admins) */}
          {user?.role === 'Admin' && (
            <button
              onClick={onOpenCreateEmployee}
              className="text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-lg transition shadow-2xs flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>+ Create Employee</span>
            </button>
          )}

          {/* User Role Badge */}
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-lg text-xs">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
              {(user?.userName || 'A').substring(0, 1).toUpperCase()}
            </span>
            <span className="font-medium text-neutral-800">{user?.userName || 'Admin'}</span>
            <span className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
              {user?.role || 'Admin'}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 px-2 py-1.5 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
