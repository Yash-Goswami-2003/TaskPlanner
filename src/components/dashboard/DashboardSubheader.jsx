'use client';

import React from 'react';

export default function DashboardSubheader({ user, teamCount = 1 }) {
  return (
    <div className="bg-neutral-50 border-b border-neutral-200 py-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-semibold bg-neutral-900 text-white px-2 py-0.5 rounded">
              JWT Authenticated
            </span>
            <span className="text-xs text-neutral-500 font-mono">• CognoDB Connected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            {user?.companyName || 'Wexa2'} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Logged in as <strong className="text-neutral-900 font-semibold">{user?.userName || 'Yash'}</strong> ({user?.role || 'DB Admin'})
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="p-3 bg-white border border-neutral-200 rounded-xl shadow-2xs">
            <div className="text-neutral-400 font-medium">Team Members</div>
            <div className="text-base font-bold text-neutral-900">{teamCount} Users</div>
          </div>
          <div className="p-3 bg-white border border-neutral-200 rounded-xl shadow-2xs">
            <div className="text-neutral-400 font-medium">Database Node</div>
            <div className="text-base font-bold text-neutral-900 font-mono">db-797445ed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
