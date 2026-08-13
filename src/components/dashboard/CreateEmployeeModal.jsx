'use client';

import React, { useState } from 'react';

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function CreateEmployeeModal({ isOpen, onClose, onEmployeeCreated }) {
  const [formData, setFormData] = useState({
    userName: '',
    userPassword: '',
    role: 'Member'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName.trim() || !formData.userPassword) {
      setStatusMessage({ type: 'error', text: 'Employee user name and password are required.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const token = localStorage.getItem('task_planner_token');
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Employee "${formData.userName}" created!` });
        if (onEmployeeCreated) onEmployeeCreated(data);
        setTimeout(() => {
          setFormData({ userName: '', userPassword: '', role: 'Member' });
          setStatusMessage(null);
          onClose();
        }, 600);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to create employee.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'success', text: `Employee "${formData.userName}" created!` });
      setTimeout(() => {
        onClose();
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Add Team Member</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Register a new member to your workspace</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Employee Name
            </label>
            <input
              type="text"
              required
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="e.g. Marcus Vance"
              className="w-full bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
            />
          </div>

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

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-zinc-50/50 text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
            >
              <option value="Member">Member</option>
              <option value="Lead Engineer">Lead Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="DB Admin">DB Admin</option>
              <option value="Product Designer">Product Designer</option>
              <option value="SecOps Lead">SecOps Lead</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium text-xs rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg transition-colors active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
