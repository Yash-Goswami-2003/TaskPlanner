'use client';

import React from 'react';
import { PRODUCT_NAME } from '../../lib/constants';

export default function Testimonials() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-neutral-200">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest block mb-2">
          Customer Impact
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-4">
          Loved by builders who value focus over clutter.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-neutral-200 rounded-xl flex flex-col justify-between">
          <p className="text-sm text-neutral-700 leading-relaxed italic mb-6">
            "{PRODUCT_NAME} cut our sprint planning meetings in half. We just type what needs to be built, and AI structures the subtasks."
          </p>
          <div>
            <div className="font-semibold text-xs text-neutral-900">Alex Morgan</div>
            <div className="text-[11px] text-neutral-500">VP of Engineering • TechCorp</div>
          </div>
        </div>

        <div className="p-6 bg-white border border-neutral-200 rounded-xl flex flex-col justify-between">
          <p className="text-sm text-neutral-700 leading-relaxed italic mb-6">
            "The black & white minimalist layout is so refreshing. Zero blue/purple distractions. It feels as fast and clean as Linear."
          </p>
          <div>
            <div className="font-semibold text-xs text-neutral-900">Jessica Wright</div>
            <div className="text-[11px] text-neutral-500">Lead Product Manager • Veloce</div>
          </div>
        </div>

        <div className="p-6 bg-white border border-neutral-200 rounded-xl flex flex-col justify-between">
          <p className="text-sm text-neutral-700 leading-relaxed italic mb-6">
            "Assigning tasks used to require navigating multiple screens. Now AI routes tasks to the right dev based on who wrote the code."
          </p>
          <div>
            <div className="font-semibold text-xs text-neutral-900">David Thorne</div>
            <div className="text-[11px] text-neutral-500">Staff Architect • CloudNative</div>
          </div>
        </div>
      </div>
    </section>
  );
}
