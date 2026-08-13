'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSubheader from './DashboardSubheader';
import DashboardSidebar from './DashboardSidebar';
import MailboxTaskList from './MailboxTaskList';
import CreateTaskModal from './CreateTaskModal';
import CreateEmployeeModal from './CreateEmployeeModal';

export default function DashboardContainer() {
  const [user, setUser] = useState({ companyName: 'Wexa2', userName: 'Yash', role: 'DB Admin' });
  const [activeView, setActiveView] = useState('mailbox'); // 'mailbox' | 'all_tasks' | 'team'
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('task_planner_user');
    const storedToken = localStorage.getItem('task_planner_token');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    if (storedToken) {
      // 1. Fetch team members count
      fetch('/api/employees', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.employees) setTeamMembers(data.employees);
        })
        .catch(() => {});

      // 2. Fetch real tasks from CognoDB
      const taskUrl = activeView === 'mailbox' ? '/api/tasks?mailbox=true' : '/api/tasks';
      fetch(taskUrl, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.tasks) setTasks(data.tasks);
        })
        .catch(() => {});
    }
  }, [activeView]);

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 1. Header Bar */}
      <DashboardHeader user={user} />

      {/* 2. Subheader Banner */}
      <DashboardSubheader user={user} teamCount={teamMembers.length || 1} />

      {/* 3. Spacious Layout (Sidebar + Task Workspace) */}
      <div className="flex-1 flex min-h-[calc(100vh-160px)]">
        {/* Left Sidebar */}
        <DashboardSidebar
          user={user}
          activeView={activeView}
          onViewChange={setActiveView}
          onOpenCreateTask={() => setIsTaskModalOpen(true)}
          onOpenCreateEmployee={() => setIsEmployeeModalOpen(true)}
        />

        {/* Spacious Main Workspace */}
        <main className="flex-1 min-w-0 bg-neutral-50/30">
          <MailboxTaskList
            tasks={tasks}
            viewTitle={activeView === 'mailbox' ? 'Mailbox (My Tasks)' : 'All Organization Tasks'}
            onOpenCreateTask={() => setIsTaskModalOpen(true)}
          />
        </main>
      </div>

      {/* 4. Modals */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <CreateEmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onEmployeeCreated={() => {
          const token = localStorage.getItem('task_planner_token');
          if (token) {
            fetch('/api/employees', { headers: { Authorization: `Bearer ${token}` } })
              .then((res) => res.json())
              .then((data) => {
                if (data.employees) setTeamMembers(data.employees);
              })
              .catch(() => {});
          }
        }}
      />
    </div>
  );
}
