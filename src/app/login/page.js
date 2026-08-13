'use client';

import React from 'react';
import LoginContainer from '../../components/login/LoginContainer';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-neutral-900 selection:text-white">
      <LoginContainer />
    </main>
  );
}
