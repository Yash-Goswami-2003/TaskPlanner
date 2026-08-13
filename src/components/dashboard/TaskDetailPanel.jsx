'use client';

import React, { useState, useEffect } from 'react';

export default function TaskDetailPanel({ task, currentUser, onTaskUpdated, onTaskDeleted }) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setDescriptionInput(task.description || '');
      setDueDateInput(task.dueDate || new Date().toISOString().split('T')[0]);
      setIsEditingDescription(false);

      // Fetch comments for current task
      fetch(`/api/tasks/comments?taskId=${task.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.comments) setComments(data.comments);
        })
        .catch(() => {});
    }
  }, [task]);

  const handleSaveDescription = async () => {
    if (!task) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('task_planner_token');
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskId: task.id,
          description: descriptionInput,
          dueDate: dueDateInput,
          priority: task.priority
        })
      });

      if (res.ok) {
        setIsEditingDescription(false);
        if (onTaskUpdated) {
          onTaskUpdated({ ...task, description: descriptionInput, dueDate: dueDateInput });
        }
      }
    } catch (err) {
      console.error('Failed to update task description:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    if (!confirm(`Are you sure you want to delete task "${task.title}" (${task.id}) from CognoDB?`)) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('task_planner_token');
      const res = await fetch(`/api/tasks?taskId=${task.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        if (onTaskDeleted) onTaskDeleted(task.id);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;

    try {
      const token = localStorage.getItem('task_planner_token');
      const res = await fetch('/api/tasks/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskId: task.id,
          content: newComment.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.comment) {
        setComments([...comments, data.comment]);
        setNewComment('');
      }
    } catch (err) {
      setComments([
        ...comments,
        { author: currentUser?.userName || 'You', content: newComment.trim(), createdAt: Date.now() }
      ]);
      setNewComment('');
    }
  };

  if (!task) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-400">
        <span className="text-3xl mb-2">📋</span>
        <h4 className="text-sm font-semibold text-neutral-700">No Task Selected</h4>
        <p className="text-xs text-neutral-400 max-w-xs mt-1">
          Select a task from your mailbox list to inspect details, edit description, or add comments.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white overflow-y-auto">
      <div className="space-y-6">
        {/* Task Title & Controls Header */}
        <div className="border-b border-neutral-200 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400 font-semibold">{task.id}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-900 text-white">
                {task.priority || 'P1'}
              </span>
              <button
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 px-2 py-0.5 rounded transition"
                title="Delete Task from CognoDB"
              >
                {isDeleting ? 'Deleting...' : 'Delete Task'}
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold text-neutral-900 leading-snug">{task.title}</h2>

          {/* Calendar Scheduler */}
          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800">Scheduler / Calendar:</span>
            <input
              type="date"
              value={dueDateInput}
              onChange={(e) => setDueDateInput(e.target.value)}
              onBlur={handleSaveDescription}
              className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-xs font-mono"
            />
          </div>
        </div>

        {/* Editable Task Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Task Description
            </span>
            {!isEditingDescription && (
              <button
                onClick={() => setIsEditingDescription(true)}
                className="text-[11px] font-semibold text-neutral-900 hover:underline"
              >
                ✎ Edit Description
              </button>
            )}
          </div>

          {isEditingDescription ? (
            <div className="space-y-2">
              <textarea
                rows={4}
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                className="w-full bg-neutral-50 text-neutral-900 border border-neutral-300 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900 resize-none"
                placeholder="Write task description..."
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditingDescription(false);
                    setDescriptionInput(task.description || '');
                  }}
                  className="px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                  className="px-3 py-1 bg-neutral-900 text-white text-xs font-semibold rounded-lg shadow-2xs hover:bg-neutral-800"
                >
                  {isSaving ? 'Saving...' : 'Save Description'}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingDescription(true)}
              className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 leading-relaxed cursor-pointer hover:border-neutral-300 transition min-h-[70px]"
            >
              {task.description || <span className="text-neutral-400 italic">Click to write task description...</span>}
            </div>
          )}
        </div>

        {/* Assigned Team Members */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            Assigned Team Members ({task.assignees?.length || 0})
          </span>
          <div className="flex flex-wrap gap-2">
            {(task.assignees || ['Admin']).map((empName, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg text-xs shadow-2xs"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {empName.substring(0, 1).toUpperCase()}
                </span>
                <span className="font-semibold text-neutral-900">{empName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Comments Section ([:COMMENTED_ON]) */}
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              Discussion & Comments ({comments.length})
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">[:COMMENTED_ON]</span>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No comments yet. Write a comment below!</p>
            ) : (
              comments.map((c, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-neutral-900">
                    <span>{c.author}</span>
                    <span className="text-[10px] text-neutral-400 font-mono font-normal">
                      {new Date(c.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">{c.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition shadow-2xs"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded-xl transition shadow-2xs disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
