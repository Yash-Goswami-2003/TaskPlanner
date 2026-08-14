'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSubheader from './DashboardSubheader';
import DashboardSidebar from './DashboardSidebar';
import MailboxTaskList from './MailboxTaskList';
import TeamMemberList from './TeamMemberList';
import PlanWithAiView from './PlanWithAiView';
import CreateTaskModal from './CreateTaskModal';
import CreateEmployeeModal from './CreateEmployeeModal';

export default function DashboardContainer() {
  const [user, setUser] = useState({ companyName: 'Wexa.ai', userName: 'Yash', role: 'DB Admin' });
  const [activeView, setActiveView] = useState('mailbox'); // 'mailbox' | 'all_tasks' | 'team' | 'ai_plan'
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const fetchTasks = () => {
    const storedToken = localStorage.getItem('task_planner_token');
    if (storedToken) {
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
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('task_planner_user');
    const storedToken = localStorage.getItem('task_planner_token');

    if (!storedToken || !storedUser) {
      router.push('/login');
      return;
    }

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

      // 2. Fetch tasks
      fetchTasks();
    }
  }, [activeView]);

  const handleTaskCreated = (newTask) => {
    if (newTask) {
      setTasks([newTask, ...tasks]);
    } else {
      fetchTasks();
    }
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
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Header Bar */}
      <DashboardHeader user={user} />

      {/* Subheader */}
      <DashboardSubheader user={user} teamCount={teamMembers.length || 1} />

      {/* Main Workspace (Sidebar + Dynamic Workspace Area) */}
      <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          user={user}
          activeView={activeView}
          onViewChange={setActiveView}
          onOpenCreateEmployee={() => setIsEmployeeModalOpen(true)}
        />

        {/* Dynamic Workspace Content */}
        <main className="flex-1 h-full min-w-0 bg-zinc-50/50 overflow-y-auto">
          {activeView === 'team' ? (
            <TeamMemberList
              members={teamMembers}
              companyName={user.companyName}
              onOpenCreateEmployee={() => setIsEmployeeModalOpen(true)}
              currentUserRole={user.role}
            />
          ) : activeView === 'ai_plan' ? (
            <PlanWithAiView
              user={user}
              onTaskCreated={() => fetchTasks()}
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
