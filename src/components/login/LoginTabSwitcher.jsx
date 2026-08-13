'use client';

import React from 'react';

export default function LoginTabSwitcher({ activeTab, onTabChange }) {
  return (
    <div className="grid grid-cols-2 gap-1 bg-neutral-100 p-1 rounded-xl mb-6 border border-neutral-200">
      <button
        type="button"
        onClick={() => onTabChange('org_admin')}
        className={`py-2.5 px-3 text-xs font-semibold rounded-lg transition text-center ${
          activeTab === 'org_admin'
            ? 'bg-neutral-900 text-white shadow-2xs'
            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
        }`}
      >
        Org Admin Login
      </button>

      <button
        type="button"
        onClick={() => onTabChange('user_member')}
        className={`py-2.5 px-3 text-xs font-semibold rounded-lg transition text-center ${
          activeTab === 'user_member'
            ? 'bg-neutral-900 text-white shadow-2xs'
            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
        }`}
      >
        Team Member Login
      </button>
    </div>
  );
}
