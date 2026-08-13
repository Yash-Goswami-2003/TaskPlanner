'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskDetailHeader from './TaskDetailHeader';
import NotionTaskHeader from './NotionTaskHeader';
import NotionTaskBody from './NotionTaskBody';
import NotionTaskComments from './NotionTaskComments';

export default function TaskContainer({ taskId }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [user, setUser] = useState({ companyName: 'Wexa2', userName: 'Yash', role: 'DB Admin' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('task_planner_user');
    const storedToken = localStorage.getItem('task_planner_token');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    if (taskId) {
      setIsLoading(true);
      fetch(`/api/tasks?id=${taskId}`, {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
      })
        .then((res) => {
          if (!res.ok) throw new Error('Task not found in CognoDB.');
          return res.json();
        })
        .then((data) => {
          if (data.task) setTask(data.task);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => setIsLoading(false));
    }
  }, [taskId]);

  const handleSaveDescription = async (newDescription) => {
    if (!task) return;
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
          description: newDescription,
          dueDate: task.dueDate,
          priority: task.priority
        })
      });

      if (res.ok) {
        setTask({ ...task, description: newDescription });
      }
    } catch (err) {
      console.error('Failed to update task description:', err);
    }
  };

  const handleDueDateChange = async (newDueDate) => {
    if (!task) return;
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
          description: task.description,
          dueDate: newDueDate,
          priority: task.priority
        })
      });

      if (res.ok) {
        setTask({ ...task, dueDate: newDueDate });
      }
    } catch (err) {
      console.error('Failed to update due date:', err);
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
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-xs font-mono text-neutral-400">
        <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span>Loading Notion Document from CognoDB...</span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center text-neutral-500">
        <span className="text-4xl mb-3">⚠️</span>
        <h2 className="text-lg font-bold text-neutral-900 mb-1">Document Not Found</h2>
        <p className="text-xs text-neutral-500 max-w-xs mb-4">
          Task "{taskId}" could not be found or has been deleted from CognoDB.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-neutral-900 text-white font-semibold text-xs rounded-xl shadow-2xs"
        >
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Bar */}
      <TaskDetailHeader
        taskId={task.id}
        user={user}
        onDeleteTask={handleDeleteTask}
        isDeleting={isDeleting}
      />

      {/* Unboxed Flush Notion Page Document Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full py-12 px-6 sm:px-8 space-y-6">
        {/* 1. Header & Property Grid */}
        <NotionTaskHeader task={task} onDueDateChange={handleDueDateChange} />

        {/* 2. Notion Document Description Body */}
        <NotionTaskBody
          description={task.description}
          onSaveDescription={handleSaveDescription}
        />

        {/* 3. Unboxed Notion Discussion Comment Stream */}
        <NotionTaskComments taskId={task.id} currentUser={user} />
      </main>
    </div>
  );
}
