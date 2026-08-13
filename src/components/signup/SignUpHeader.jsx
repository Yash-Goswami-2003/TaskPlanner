'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCT_NAME } from '../../lib/constants';

export default function SignUpHeader() {
  return (
    <div className="text-center flex flex-col items-center mb-6">
      <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-semibold text-xs group-hover:bg-zinc-700 transition-colors">
          P
        </div>
        <span className="font-semibold text-zinc-900 text-base tracking-tight">
          {PRODUCT_NAME}
        </span>
      </Link>
      <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
        Register Organization
      </h2>
      <p className="text-xs text-zinc-400 mt-0.5">
        Create a unique company workspace backed by CognoDB
      </p>
    </div>
  );
}
