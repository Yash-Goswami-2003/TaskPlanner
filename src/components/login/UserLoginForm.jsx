'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    userName: '',
    userPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.userName.trim() || !formData.userPassword) {
      setStatusMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'user_member', ...formData })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem('task_planner_token', data.token);
        localStorage.setItem('task_planner_user', JSON.stringify(data.user));
        document.cookie = `task_planner_token=${data.token}; path=/; max-age=604800`;

        setStatusMessage({ type: 'success', text: `Welcome ${formData.userName}! Redirecting...` });
        setTimeout(() => router.push('/dashboard'), 500);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Authentication failed. Please check credentials.' });
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
          Company Name
        </label>
        <input
          type="text"
          required
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="e.g. Wexa.ai"
          className="w-full bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
        />
      </div>

      {/* User Name */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
          User Name
        </label>
        <input
          type="text"
          required
          value={formData.userName}
          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
          placeholder="e.g. Yash"
          className="w-full bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
        />
      </div>

      {/* User Password */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
          Password
        </label>
        <input
          type="password"
          required
          value={formData.userPassword}
          onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
          placeholder="••••••••••••"
          className="w-full bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? 'Verifying Credentials...' : 'Log In as Team Member'}
      </button>
    </form>
  );
}
