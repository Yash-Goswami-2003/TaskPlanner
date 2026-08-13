'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LoginHeader from './LoginHeader';
import LoginTabSwitcher from './LoginTabSwitcher';
import OrgLoginForm from './OrgLoginForm';
import UserLoginForm from './UserLoginForm';

export default function LoginContainer() {
  const [activeTab, setActiveTab] = useState('org_admin');

  return (
    <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 sm:p-7">
      <LoginHeader />

      {/* 2-Tab Switcher */}
      <LoginTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Forms */}
      {activeTab === 'org_admin' ? (
        <OrgLoginForm />
      ) : (
        <UserLoginForm />
      )}

      <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
        <p className="text-xs text-zinc-400">
          Don't have an organization registered?{' '}
          <Link href="/signup" className="font-semibold text-zinc-900 hover:underline">
            Register Organization →
          </Link>
        </p>
      </div>
    </div>
  );
}
