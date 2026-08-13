'use client';

import React from 'react';
import SignUpContainer from '../../components/signup/SignUpContainer';

export default function SignUpPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-neutral-900 selection:text-white">
      <SignUpContainer />
    </main>
  );
}
