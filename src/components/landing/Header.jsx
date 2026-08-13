'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCT_NAME } from '../../lib/constants';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-neutral-800 transition">
            T
          </div>
          <span className="font-semibold text-neutral-900 text-base tracking-tight">
            {PRODUCT_NAME}
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <a href="#planner-demo" className="hover:text-neutral-900 transition">Planner Preview</a>
          <a href="#ai-capabilities" className="hover:text-neutral-900 transition">AI Capabilities</a>
          <a href="#comparison" className="hover:text-neutral-900 transition">Why Task Planner</a>
          <a href="#pricing" className="hover:text-neutral-900 transition">Pricing</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 transition hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg transition active:scale-[0.98] shadow-2xs"
          >
            Start for free
          </Link>
        </div>
      </div>
    </header>
  );
}
