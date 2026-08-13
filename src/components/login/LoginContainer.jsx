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
    <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
      <LoginHeader />

      {/* 2-Tab Switcher */}
      <LoginTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Forms */}
      {activeTab === 'org_admin' ? (
        <OrgLoginForm />
      ) : (
        <UserLoginForm />
      )}

      <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
        <p className="text-xs text-neutral-500">
          Don't have an organization registered?{' '}
          <Link href="/signup" className="font-semibold text-neutral-900 hover:underline">
            Register Organization →
          </Link>
        </p>
      </div>
    </div>
  );
}
