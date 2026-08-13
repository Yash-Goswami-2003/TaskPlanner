'use client';

import React, { useState, useEffect } from 'react';

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const priorityOptions = [
  { id: 'P1', label: 'P1 · High', dot: 'bg-red-500' },
  { id: 'P2', label: 'P2 · Medium', dot: 'bg-orange-500' },
  { id: 'P3', label: 'P3 · Low', dot: 'bg-yellow-500' },
  { id: 'P4', label: 'P4 · Low', dot: 'bg-zinc-400' },
];

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'P1',
    startDate: todayStr,
    dueDate: todayStr,
    selectedAssignees: []
  });
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('task_planner_token');
      fetch('/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.employees && data.employees.length > 0) {
            setAvailableEmployees(data.employees.map((e) => e.name));
          } else {
            setAvailableEmployees(['Admin']);
          }
        })
        .catch(() => setAvailableEmployees(['Admin']));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAssignee = (name) => {
    setFormData((prev) => {
      const exists = prev.selectedAssignees.includes(name);
      return {
        ...prev,
        selectedAssignees: exists
          ? prev.selectedAssignees.filter((n) => n !== name)
          : [...prev.selectedAssignees, name]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setStatusMessage({ type: 'error', text: 'Task title is required.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const token = localStorage.getItem('task_planner_token');
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          startDate: formData.startDate,
          dueDate: formData.dueDate,
          assignees: formData.selectedAssignees
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: 'Task created successfully.' });
        if (onTaskCreated) onTaskCreated(data.task);
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            priority: 'P1',
            startDate: todayStr,
            dueDate: todayStr,
            selectedAssignees: []
          });
          setStatusMessage(null);
          onClose();
        }, 400);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to create task.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Connection error while creating task.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Create New Task</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Define task details, timeline, and assign team members</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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

          {/* Task Title */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement OAuth2 Refresh Tokens"
              className="w-full bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Task Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write detailed specifications, notes, or implementation requirements..."
              className="w-full bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Priority Chips */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: opt.id })}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                    formData.priority === opt.id
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline: Start Date & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-zinc-50/50 text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-zinc-50/50 text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Assignees List */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Assign Team Members
            </label>
            <div className="p-2.5 bg-zinc-50/50 border border-zinc-200 rounded-lg space-y-1.5 max-h-36 overflow-y-auto">
              {availableEmployees.length === 0 ? (
                <p className="text-xs text-zinc-400 p-1">Loading members...</p>
              ) : (
                availableEmployees.map((empName) => {
                  const isSelected = formData.selectedAssignees.includes(empName);
                  return (
                    <div
                      key={empName}
                      onClick={() => handleToggleAssignee(empName)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors border ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            isSelected ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          {empName.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-medium text-xs">{empName}</span>
                      </div>
                      <span className="text-[10px] font-medium opacity-80">
                        {isSelected ? '✓ Assigned' : '+ Add'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer Actions */}
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
              {isLoading ? 'Saving...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
