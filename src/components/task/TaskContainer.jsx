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

  const handleUpdateTaskProperty = async (updates) => {
    if (!task) return;
    const updatedTask = { ...task, ...updates };
    setTask(updatedTask); // optimistic update

    try {
      const token = localStorage.getItem('task_planner_token');
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskId: task.id,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          startDate: updatedTask.startDate,
          dueDate: updatedTask.dueDate
        })
      });
    } catch (err) {
      console.error('Failed to update task property:', err);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;

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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-xs font-mono text-zinc-400">
        <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-2" />
        <span>Loading task details...</span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center text-zinc-500">
        <h2 className="text-base font-semibold text-zinc-900 mb-1">Task Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-xs mb-4">
          Task "{taskId}" could not be found or has been deleted.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-zinc-900 text-white font-semibold text-xs rounded-lg shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <TaskDetailHeader
        taskId={task.id}
        taskTitle={task.title}
        user={user}
        onDeleteTask={handleDeleteTask}
        isDeleting={isDeleting}
      />

      {/* Main Task Document Body */}
      <main className="flex-1 max-w-3xl mx-auto w-full py-10 px-6 sm:px-8 space-y-6">
        {/* Header & Property Grid */}
        <NotionTaskHeader
          task={task}
          onStatusChange={(status) => handleUpdateTaskProperty({ status })}
          onPriorityChange={(priority) => handleUpdateTaskProperty({ priority })}
          onStartDateChange={(startDate) => handleUpdateTaskProperty({ startDate })}
          onDueDateChange={(dueDate) => handleUpdateTaskProperty({ dueDate })}
        />

        {/* Task Description */}
        <NotionTaskBody
          description={task.description}
          onSaveDescription={(description) => handleUpdateTaskProperty({ description })}
        />

        {/* Discussion / Comments Stream */}
        <NotionTaskComments taskId={task.id} currentUser={user} />
      </main>
    </div>
  );
}
