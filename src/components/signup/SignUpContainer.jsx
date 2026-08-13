'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SignUpHeader from './SignUpHeader';
import OrgSignUpForm from './OrgSignUpForm';

export default function SignUpContainer() {
  const router = useRouter();
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
      <SignUpHeader />
      <OrgSignUpForm />

      <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
        <p className="text-xs text-zinc-400">
          Already registered your organization?{' '}
          <Link href="/login" className="font-semibold text-zinc-900 hover:underline">
            Log In →
          </Link>
        </p>
      </div>
    </div>
  );
}
