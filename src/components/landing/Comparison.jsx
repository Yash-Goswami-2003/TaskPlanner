'use client';

import React from 'react';
import { COMPARISON_ITEMS, PRODUCT_NAME } from '../../lib/constants';

export default function Comparison() {
  return (
    <section id="comparison" className="py-20 px-6 max-w-5xl mx-auto border-t border-neutral-200">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest block mb-2">
          The Comparison
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
          Why engineering teams switch to {PRODUCT_NAME}.
        </h2>
        <p className="text-base text-neutral-600">
          Legacy issue trackers are built for micro-management. {PRODUCT_NAME} is built for momentum.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-neutral-50 border-b border-neutral-200 p-4 text-xs font-semibold text-neutral-900 uppercase tracking-wider">
          <div className="col-span-4">Capability</div>
          <div className="col-span-4 text-neutral-400">Legacy Jira</div>
          <div className="col-span-4 font-bold text-neutral-900">{PRODUCT_NAME}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-neutral-200 text-sm">
          {COMPARISON_ITEMS.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 p-4 items-center hover:bg-neutral-50/50 transition">
              <div className="col-span-4 font-semibold text-neutral-900">{item.category}</div>
              <div className="col-span-4 text-neutral-500 text-xs pr-2">{item.jira}</div>
              <div className="col-span-4 font-medium text-neutral-900 text-xs flex items-center gap-1.5">
                <span className="font-bold">✓</span> {item.pickTheTask}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
