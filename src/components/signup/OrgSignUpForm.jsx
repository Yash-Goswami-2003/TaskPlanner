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
          text: `Organization "${formData.companyName}" registered! Redirecting...`
        });
        setTimeout(() => {
          router.push(`/login?company=${encodeURIComponent(formData.companyName)}`);
        }, 1000);
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
          className={`p-3 rounded-lg text-xs font-medium border ${
            statusMessage.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Company Name */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
          Organization / Company Name
        </label>
        <input
          type="text"
          required
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="e.g. Acme Corporation"
          className="w-full bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
        />
        <p className="text-[10px] text-zinc-400 mt-1">Must be unique across Task Planner organizations.</p>
      </div>

      {/* Admin Password */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
          Admin Password
        </label>
        <input
          type="password"
          required
          value={formData.adminPassword}
          onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
          placeholder="••••••••••••"
          className="w-full bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
        />
        <p className="text-[10px] text-zinc-400 mt-1">Used to log in as Organization Admin.</p>
      </div>

      {/* Team Size */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
          Estimated Team Size
        </label>
        <select
          value={formData.teamSize}
          onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
          className="w-full bg-zinc-50/50 text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
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
        className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? 'Registering...' : 'Register Organization'}
      </button>
    </form>
  );
}
