'use client';

import React from 'react';

export default function TabSwitcher({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'org_signup', label: 'Org Sign Up' },
    { id: 'user_signup', label: 'User Sign Up' },
    { id: 'org_login', label: 'Org Log In' },
    { id: 'user_login', label: 'User Log In' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-neutral-100 p-1 rounded-xl mb-6 border border-neutral-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition text-center whitespace-nowrap ${
            activeTab === tab.id
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
