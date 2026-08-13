'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginHeader from './LoginHeader';
import LoginTabSwitcher from './LoginTabSwitcher';
import OrgLoginForm from './OrgLoginForm';
import UserLoginForm from './UserLoginForm';

export default function LoginContainer() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('org_admin');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('task_planner_token');
    const user = localStorage.getItem('task_planner_user');
    if (token && user) {
      router.push('/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[280px]">
        <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs text-zinc-400 font-mono">Checking session...</span>
      </div>
    );
  }

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
