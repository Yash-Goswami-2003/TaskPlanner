'use client';

import React from 'react';

export default function LoginTabSwitcher({ activeTab, onTabChange }) {
  return (
    <div className="grid grid-cols-2 gap-1 bg-zinc-100/80 p-1 rounded-lg mb-5 border border-zinc-200/60">
      <button
        type="button"
        onClick={() => onTabChange('org_admin')}
        className={`py-2 px-3 text-xs font-semibold rounded-md transition-all text-center ${
          activeTab === 'org_admin'
            ? 'bg-zinc-900 text-white shadow-2xs'
            : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
        }`}
      >
        Org Admin
      </button>

      <button
        type="button"
        onClick={() => onTabChange('user_member')}
        className={`py-2 px-3 text-xs font-semibold rounded-md transition-all text-center ${
          activeTab === 'user_member'
            ? 'bg-zinc-900 text-white shadow-2xs'
            : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
        }`}
      >
        Team Member
      </button>
    </div>
  );
}
