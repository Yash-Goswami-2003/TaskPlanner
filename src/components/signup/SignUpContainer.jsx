'use client';

import React from 'react';
import Link from 'next/link';
import SignUpHeader from './SignUpHeader';
import OrgSignUpForm from './OrgSignUpForm';

export default function SignUpContainer() {
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
