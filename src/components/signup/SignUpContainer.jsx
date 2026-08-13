'use client';

import React from 'react';
import Link from 'next/link';
import SignUpHeader from './SignUpHeader';
import OrgSignUpForm from './OrgSignUpForm';

export default function SignUpContainer() {
  return (
    <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
      <SignUpHeader />
      <OrgSignUpForm />

      <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
        <p className="text-xs text-neutral-500">
          Already registered your organization?{' '}
          <Link href="/login" className="font-semibold text-neutral-900 hover:underline">
            Log In →
          </Link>
        </p>
      </div>
    </div>
  );
}
