'use client';

import React from 'react';
import { AI_FEATURES } from '../../lib/constants';

export default function AICapabilities() {
  return (
    <section id="ai-capabilities" className="py-20 px-6 max-w-6xl mx-auto border-t border-neutral-200">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest block mb-2">
          Artificial Intelligence
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
          Designed for clarity. Powered by AI.
        </h2>
        <p className="text-base text-neutral-600">
          Four intelligent features designed to remove task friction and eliminate manual project overhead.
        </p>
      </div>

      {/* 4 Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AI_FEATURES.map((feature, idx) => (
          <div
            key={idx}
            className="p-8 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-400 transition shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 px-2.5 py-1 rounded-md">
                  {feature.tag}
                </span>
                <span className="text-xs font-mono text-neutral-400">0{idx + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{feature.description}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-medium text-neutral-900">
              <span>Learn how it works</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
