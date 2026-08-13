'use client';

import React from 'react';
import { PRODUCT_NAME } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-12 px-6 bg-white text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
            P
          </div>
          <span className="font-semibold text-neutral-900">{PRODUCT_NAME}</span>
          <span className="text-neutral-400">© 2026. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-neutral-900 transition">Privacy Policy</a>
          <a href="#" className="hover:text-neutral-900 transition">Terms of Service</a>
          <a href="#" className="hover:text-neutral-900 transition">Security</a>
          <a href="#" className="hover:text-neutral-900 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}
