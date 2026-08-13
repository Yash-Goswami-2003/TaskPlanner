'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCT_NAME } from '../../lib/constants';

export default function AuthHeader({ subtitle }) {
  return (
    <div className="text-center flex flex-col items-center mb-6">
      <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
        <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-base shadow-xs group-hover:bg-neutral-800 transition">
          T
        </div>
        <span className="font-bold text-neutral-900 text-xl tracking-tight">
          {PRODUCT_NAME}
        </span>
      </Link>
      <p className="text-xs text-neutral-500 max-w-xs">{subtitle}</p>
    </div>
  );
}
