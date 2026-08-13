'use client';

import React from 'react';

export default function DashboardSubheader({ user, teamCount = 1 }) {
  return (
    <div className="bg-white border-b border-zinc-100 px-6 py-5">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Title block */}
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 leading-none">
            {user?.companyName || 'Wexa.ai'} <span className="text-zinc-400 font-normal">Dashboard</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Signed in as <span className="text-zinc-700 font-medium">{user?.userName || 'Admin'}</span> · {user?.role || 'Admin'}
          </p>
        </div>

        {/* Stats */}
        <div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Team</div>
            <div className="text-sm font-bold text-zinc-900 leading-snug">{teamCount} member{teamCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
