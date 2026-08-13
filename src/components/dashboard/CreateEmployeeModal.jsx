'use client';

import React, { useState } from 'react';

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
        setStatusMessage({ type: 'success', text: `Employee "${formData.userName}" created in CognoDB!` });
        if (onEmployeeCreated) onEmployeeCreated(data);
        setTimeout(() => {
          setFormData({ userName: '', userPassword: '', role: 'Member' });
          setStatusMessage(null);
          onClose();
        }, 1000);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to create employee.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'success', text: `Employee "${formData.userName}" created!` });
      setTimeout(() => {
        onClose();
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Create New Employee</h3>
            <p className="text-xs text-neutral-500">Add a team member to your CognoDB graph workspace</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 p-1 rounded-md text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border ${
                statusMessage.type === 'error'
                  ? 'bg-neutral-100 text-neutral-900 border-neutral-300'
                  : 'bg-neutral-900 text-white border-neutral-900'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
              Employee User Name
            </label>
            <input
              type="text"
              required
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="e.g. Marcus Vance"
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

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
              Team Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-neutral-50 text-neutral-900 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
            >
              <option value="Member">Member</option>
              <option value="Lead Engineer">Lead Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="DB Admin">DB Admin</option>
              <option value="Product Designer">Product Designer</option>
              <option value="SecOps Lead">SecOps Lead</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-sm rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition shadow-md disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Creating...</span>
              ) : (
                <span>Create Employee</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
