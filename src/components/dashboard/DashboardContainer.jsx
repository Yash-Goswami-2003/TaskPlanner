'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSubheader from './DashboardSubheader';
import DashboardSidebar from './DashboardSidebar';
import MailboxTaskList from './MailboxTaskList';
import TeamMemberList from './TeamMemberList';
import CreateTaskModal from './CreateTaskModal';
import CreateEmployeeModal from './CreateEmployeeModal';

export default function DashboardContainer() {
  const [user, setUser] = useState({ companyName: 'Wexa.ai', userName: 'Yash', role: 'DB Admin' });
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
      // 1. Fetch team members list
      fetch('/api/employees', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.employees) setTeamMembers(data.employees);
        })
        .catch(() => {});

      // 2. Fetch tasks (mailbox assigned tasks vs all org tasks)
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

  const handleEmployeeCreated = () => {
    const token = localStorage.getItem('task_planner_token');
    if (token) {
      fetch('/api/employees', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => {
          if (data.employees) setTeamMembers(data.employees);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Header Bar */}
      <DashboardHeader user={user} />

      {/* Subheader */}
      <DashboardSubheader user={user} teamCount={teamMembers.length || 1} />

      {/* Main Workspace (Sidebar + Dynamic Workspace Area) */}
      <div className="flex-1 flex min-h-[calc(100vh-100px)]">
        {/* Sidebar */}
        <DashboardSidebar
          user={user}
          activeView={activeView}
          onViewChange={setActiveView}
          onOpenCreateTask={() => setIsTaskModalOpen(true)}
          onOpenCreateEmployee={() => setIsEmployeeModalOpen(true)}
        />

        {/* Dynamic Workspace Content */}
        <main className="flex-1 min-w-0 bg-zinc-50/50">
          {activeView === 'team' ? (
            <TeamMemberList
              members={teamMembers}
              companyName={user.companyName}
              onOpenCreateEmployee={() => setIsEmployeeModalOpen(true)}
              currentUserRole={user.role}
            />
          ) : (
            <MailboxTaskList
              tasks={tasks}
              viewTitle={activeView === 'mailbox' ? 'My Tasks' : 'All Tasks'}
              onOpenCreateTask={() => setIsTaskModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <CreateEmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
      />
    </div>
  );
}
