'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrgSignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    adminPassword: '',
    teamSize: '1-10'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.adminPassword) {
      setStatusMessage({ type: 'error', text: 'Company name and admin password are required.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: `Organization "${formData.companyName}" registered successfully! Redirecting to login...`
        });
        setTimeout(() => {
          router.push(`/login?company=${encodeURIComponent(formData.companyName)}`);
        }, 1200);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to register organization.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network connection error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border ${
            statusMessage.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-neutral-900 text-white border-neutral-900'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Company Name */}
      <div>
        <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
          Organization / Company Name
        </label>
        <input
          type="text"
          required
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="e.g. Acme Corporation"
          className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition shadow-2xs"
        />
        <p className="text-[11px] text-neutral-400 mt-1">Must be unique across Task Planner organizations.</p>
      </div>

      {/* Admin Password */}
      <div>
        <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
          Admin Password
        </label>
        <input
          type="password"
          required
          value={formData.adminPassword}
          onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
          placeholder="••••••••••••"
          className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition shadow-2xs"
        />
        <p className="text-[11px] text-neutral-400 mt-1">Used to log in as Organization Admin & manage users.</p>
      </div>

      {/* Team Size Optional Field */}
      <div>
        <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
          Estimated Team Size
        </label>
        <select
          value={formData.teamSize}
          onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
          className="w-full bg-neutral-50 text-neutral-900 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
        >
          <option value="1-10">1 - 10 members</option>
          <option value="11-50">11 - 50 members</option>
          <option value="51-200">51 - 200 members</option>
          <option value="200+">200+ members</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Registering Organization...</span>
          </>
        ) : (
          <span>Register Organization</span>
        )}
      </button>
    </form>
  );
}
