'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCT_NAME } from '../../lib/constants';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
      {/* Minimalist Top Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-700 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
        <span>{PRODUCT_NAME} • AI Release</span>
        <span className="text-neutral-300">•</span>
        <span className="text-neutral-500">v2.0 Minimal</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.1] max-w-4xl mb-6">
        Plan, assign, and execute work at the speed of thought.
      </h1>

      {/* Short Supporting Sentence */}
      <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl font-normal leading-relaxed mb-10">
        Create tasks from natural language, assign team members, and track progress—without legacy clutter or blue-purple visual noise.
      </p>

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-16">
        <Link
          href="/signup"
          className="w-full sm:w-auto px-7 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm rounded-xl shadow-xs transition active:scale-[0.98] text-center"
        >
          Start planning free
        </Link>
        <Link
          href="/login"
          className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 font-medium text-sm rounded-xl border border-neutral-200 transition text-center"
        >
          Log in to workspace
        </Link>
      </div>

      {/* Subtle Team Metrics */}
      <div className="flex items-center gap-8 text-xs text-neutral-500 font-medium border-t border-neutral-100 pt-8">
        <div><strong className="text-neutral-900 font-semibold">10x</strong> faster creation</div>
        <div className="text-neutral-300">•</div>
        <div><strong className="text-neutral-900 font-semibold">100%</strong> black & white clarity</div>
        <div className="text-neutral-300">•</div>
        <div><strong className="text-neutral-900 font-semibold">Zero</strong> clutter</div>
      </div>
    </section>
  );
}
