'use client';

import React, { useState, useEffect } from 'react';

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'P1',
    dueDate: todayStr,
    selectedAssignees: []
  });
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Fetch live organization employees from CognoDB
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
          dueDate: formData.dueDate,
          assignees: formData.selectedAssignees
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: `Task created and assigned in CognoDB!` });
        if (onTaskCreated) onTaskCreated(data.task);
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            priority: 'P1',
            dueDate: todayStr,
            selectedAssignees: []
          });
          setStatusMessage(null);
          onClose();
        }, 600);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to create task in CognoDB.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Connection error while creating task.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white border border-neutral-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Create New Task</h3>
            <p className="text-xs text-neutral-500">Plan work, select calendar deadline, and multi-assign team members</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 p-1 rounded-md text-sm">
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

          {/* Task Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement OAuth2 Refresh Tokens"
              className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
              Task Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write detailed specifications, notes, or implementation details..."
              className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none transition shadow-2xs resize-none"
            />
          </div>

          {/* Grid: Priority & Calendar Scheduler */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-neutral-50 text-neutral-900 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none transition"
              >
                <option value="P1">P1 - High Priority</option>
                <option value="P2">P2 - Medium Priority</option>
                <option value="P3">P3 - Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
                Scheduler / Calendar Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-neutral-50 text-neutral-900 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none transition"
              />
            </div>
          </div>

          {/* Multi-Select Assignees Checklist */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
              Assign Team Members (Multi-Select)
            </label>
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 max-h-36 overflow-y-auto">
              {availableEmployees.length === 0 ? (
                <p className="text-xs text-neutral-400">Loading team members...</p>
              ) : (
                availableEmployees.map((empName) => {
                  const isSelected = formData.selectedAssignees.includes(empName);
                  return (
                    <div
                      key={empName}
                      onClick={() => handleToggleAssignee(empName)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition border ${
                        isSelected
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-900 font-bold text-[10px] flex items-center justify-center">
                          {empName.substring(0, 1).toUpperCase()}
                        </span>
                        <span className="font-medium">{empName}</span>
                      </div>
                      <span className="font-mono text-[10px]">
                        {isSelected ? '✓ Assigned' : '+ Add'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
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
              {isLoading ? <span>Saving to CognoDB...</span> : <span>Create & Assign Task</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
