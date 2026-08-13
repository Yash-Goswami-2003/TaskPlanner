'use client';

import React from 'react';

export default function CTASection() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto text-center border-t border-neutral-200">
      <div className="p-10 sm:p-14 bg-neutral-900 text-white rounded-3xl shadow-xl flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Ready to manage tasks at the speed of thought?
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 max-w-lg mb-8 leading-relaxed">
          Join thousands of engineering teams planning work effortlessly with AI. No credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href="#planner-demo"
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm rounded-xl transition shadow-xs"
          >
            Start free today
          </a>
          <a
            href="#planner-demo"
            className="w-full sm:w-auto px-7 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm rounded-xl border border-neutral-700 transition"
          >
            Schedule a team demo
          </a>
        </div>
      </div>
    </section>
  );
}
