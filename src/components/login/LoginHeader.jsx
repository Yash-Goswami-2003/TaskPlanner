'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCT_NAME } from '../../lib/constants';

export default function LoginHeader() {
  return (
    <div className="text-center flex flex-col items-center mb-6">
      <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-neutral-800 transition">
          T
        </div>
        <span className="font-bold text-neutral-900 text-2xl tracking-tight">
          {PRODUCT_NAME}
        </span>
      </Link>
      <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">
        Welcome Back
      </h2>
      <p className="text-xs text-neutral-500 max-w-xs">
        Log in to access your organization workspace.
      </p>
    </div>
  );
}
