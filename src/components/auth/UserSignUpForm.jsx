'use client';

import React, { useState } from 'react';

export default function UserSignUpForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    organizationName: '',
    userName: '',
    userPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.organizationName || !formData.userName || !formData.userPassword) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user_signup', ...formData })
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `User "${formData.userName}" created under ${formData.organizationName}!` });
        if (onSubmitSuccess) onSubmitSuccess(data);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to create user.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'success', text: `User "${formData.userName}" registered successfully for ${formData.organizationName}!` });
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
              ? 'bg-neutral-100 text-neutral-900 border-neutral-300'
              : 'bg-neutral-900 text-white border-neutral-900'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Organization Name */}
      <div>
        <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
          Organization Name
        </label>
        <input
          type="text"
          required
          value={formData.organizationName}
          onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
          placeholder="e.g. Acme Corporation"
          className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition"
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
          className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition"
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
          className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm rounded-xl transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Registering User...</span>
          </>
        ) : (
          <span>Register User</span>
        )}
      </button>
    </form>
  );
}
