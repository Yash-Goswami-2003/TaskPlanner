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
        setTimeout(() => router.push('/dashboard'), 600);
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
          Company Name
        </label>
        <input
          type="text"
          required
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="e.g. Acme Corporation"
          className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition shadow-2xs"
        />
      </div>

      {/* User Name */}
      <div>
        <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
          User Name
        </label>
        <input
          type="text"
          required
          value={formData.userName}
          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
          placeholder="e.g. Bob Smith"
          className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition shadow-2xs"
        />
      </div>

      {/* User Password */}
      <div>
        <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
          User Password
        </label>
        <input
          type="password"
          required
          value={formData.userPassword}
          onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
          placeholder="••••••••••••"
          className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition shadow-2xs"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Verifying Member Credentials...</span>
          </>
        ) : (
          <span>Log In as Team Member</span>
        )}
      </button>
    </form>
  );
}
