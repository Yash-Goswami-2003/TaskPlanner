'use client';

import React from 'react';

export default function DashboardSubheader({ user, teamCount = 1 }) {
  const initial = (user?.userName || 'A').substring(0, 1).toUpperCase();

  return (
    <div className="bg-white border-b border-zinc-100 px-6 py-3.5 shrink-0">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Title block with user identity badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center shrink-0 ring-2 ring-zinc-100 shadow-2xs">
            {initial}
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 leading-none">
              {user?.companyName || 'Wexa.ai'} <span className="text-zinc-400 font-normal">Dashboard</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Signed in as <span className="text-zinc-900 font-semibold">{user?.userName || 'Admin'}</span> · <span className="text-zinc-500 font-medium">{user?.role || 'Admin'}</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Team</div>
            <div className="text-sm font-bold text-zinc-900 leading-snug">{teamCount} member{teamCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
