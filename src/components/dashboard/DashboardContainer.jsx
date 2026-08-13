'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from './DashboardHeader';
import CreateEmployeeModal from './CreateEmployeeModal';
import TaskPlannerPreview from '../landing/TaskPlannerPreview';

export default function DashboardContainer() {
  const router = useRouter();
  const [user, setUser] = useState({ companyName: 'Acme Tech', userName: 'Admin', role: 'Admin' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([
    { name: 'Alice Vance', role: 'Admin', initials: 'AV' },
    { name: 'Sarah Chen', role: 'Lead Engineer', initials: 'SC' },
    { name: 'Marcus Vance', role: 'DB Admin', initials: 'MV' },
    { name: 'Elena Rostova', role: 'Product Designer', initials: 'ER' }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('task_planner_user');
    const storedToken = localStorage.getItem('task_planner_token');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    // Fetch live employees from CognoDB API
    if (storedToken) {
      fetch('/api/employees', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.employees && data.employees.length > 0) {
            setEmployees(data.employees);
          }
        })
        .catch((e) => {});
    }
  }, []);

  const handleEmployeeCreated = (newEmpData) => {
    // Refresh employee list
    const token = localStorage.getItem('task_planner_token');
    if (token) {
      fetch('/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.employees && data.employees.length > 0) {
            setEmployees(data.employees);
          }
        })
        .catch(() => {});
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 1. Top Header Bar */}
      <DashboardHeader
        user={user}
        onOpenCreateEmployee={() => setIsModalOpen(true)}
      />

      {/* 2. Workspace Overview Header Banner */}
      <div className="bg-neutral-50 border-b border-neutral-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold bg-neutral-900 text-white px-2 py-0.5 rounded">
                JWT Authenticated
              </span>
              <span className="text-xs text-neutral-500">• CognoDB Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              {user.companyName} Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
              Logged in as <strong className="text-neutral-900 font-semibold">{user.userName}</strong> ({user.role})
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-3 bg-white border border-neutral-200 rounded-xl shadow-2xs">
              <div className="text-neutral-400 font-medium">Team Members</div>
              <div className="text-lg font-bold text-neutral-900">{employees.length} Users</div>
            </div>
            <div className="p-3 bg-white border border-neutral-200 rounded-xl shadow-2xs">
              <div className="text-neutral-400 font-medium">Database Node</div>
              <div className="text-lg font-bold text-neutral-900">db-797445ed</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Team Roster Bar */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Organization Team Members
            </h3>
            <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-mono">
              {employees.length}
            </span>
          </div>

          {user.role === 'Admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-medium text-neutral-900 hover:underline"
            >
              + Create Employee Node →
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {employees.map((emp, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-2 rounded-xl text-xs shadow-2xs hover:border-neutral-400 transition"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                {emp.initials}
              </div>
              <div>
                <span className="font-semibold text-neutral-900 block leading-tight">{emp.name}</span>
                <span className="text-[10px] text-neutral-500">{emp.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Task Planner Workspace */}
      <div className="py-8">
        <TaskPlannerPreview />
      </div>

      {/* 5. Create Employee Modal (Admin Only) */}
      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
      />
    </div>
  );
}
