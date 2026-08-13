'use client';

import React, { useState } from 'react';
import { SAMPLE_TASKS, PRODUCT_NAME } from '../../lib/constants';

export default function TaskPlannerPreview() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState('TASK-101');
  const [prompt, setPrompt] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  // Handle interactive AI natural language task creation
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newTask = {
        id: `TASK-${105 + tasks.length}`,
        title: prompt,
        description: "AI created and structured this task based on your input instruction.",
        assignee: {
          name: "Alex Rivera",
          initials: "AR",
          role: "Frontend Engineer"
        },
        status: "In Progress",
        priority: "P1",
        dueDate: "In 2 days",
        subtasks: [
          { id: `sub-${Date.now()}-1`, title: "Initial technical specification", done: true },
          { id: `sub-${Date.now()}-2`, title: "Component implementation", done: false },
          { id: `sub-${Date.now()}-3`, title: "Write unit tests", done: false }
        ],
        aiNote: "AI generated 3 subtasks and assigned Alex Rivera based on bandwidth."
      };

      setTasks([newTask, ...tasks]);
      setSelectedTaskId(newTask.id);
      setPrompt('');
      setIsProcessing(false);
    }, 500);
  };

  // Toggle subtask checkbox
  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          subtasks: task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, done: !st.done } : st
          )
        };
      })
    );
  };

  const filteredTasks = tasks.filter((t) =>
    statusFilter === 'All' ? true : t.status === statusFilter
  );

  return (
    <section id="planner-demo" className="px-4 sm:px-6 max-w-6xl mx-auto pb-28">
      {/* Container Window */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden">
        {/* Top App Title Bar */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-neutral-300"></span>
            <span className="w-3 h-3 rounded-full bg-neutral-300"></span>
            <span className="w-3 h-3 rounded-full bg-neutral-300"></span>
            <span className="text-xs font-semibold text-neutral-500 ml-2 tracking-wide uppercase">
              {PRODUCT_NAME} • Workspace
            </span>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {tasks.length} active tasks
          </span>
        </div>

        {/* Natural Language Task Input Bar */}
        <div className="p-5 border-b border-neutral-200 bg-white">
          <form onSubmit={handleCreateTask} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AI to plan a task: e.g. 'Build Stripe webhook handler and assign to Sarah'..."
                className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 hidden sm:inline">
                ↵ Enter
              </span>
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isProcessing}
              className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Planning...</span>
                </>
              ) : (
                <span>Plan with AI</span>
              )}
            </button>
          </form>

          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-neutral-500">
            <span className="font-medium text-neutral-400">Try typing:</span>
            <button
              type="button"
              onClick={() => setPrompt("Audit database indexes causing latency spikes")}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-md transition font-medium"
            >
              "Audit database indexes"
            </button>
            <button
              type="button"
              onClick={() => setPrompt("Design responsive checkout confirmation page")}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-md transition font-medium"
            >
              "Design checkout confirmation"
            </button>
          </div>
        </div>

        {/* Workspace Grid View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Left Column: Task List (7 cols) */}
          <div className="lg:col-span-7 border-r border-neutral-200 p-5 space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-1.5">
                {['All', 'In Progress', 'To Do', 'Completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                      statusFilter === tab
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedTaskId === task.id
                      ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">{task.id}</span>
                      <h4 className="text-sm font-semibold text-neutral-900 leading-snug">{task.title}</h4>
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                        task.status === 'Completed'
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : task.status === 'In Progress'
                          ? 'bg-neutral-100 text-neutral-900 border-neutral-300'
                          : 'bg-white text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{task.description}</p>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100 text-neutral-500">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {task.assignee.initials}
                      </span>
                      <span className="font-medium text-neutral-700">{task.assignee.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-500">
                        {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks
                      </span>
                      <span className="font-semibold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Task Detail & Subtask Inspector (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-neutral-50/50 flex flex-col justify-between">
            {selectedTask && (
              <div className="space-y-5">
                {/* Detail Header */}
                <div className="border-b border-neutral-200 pb-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-1">
                    <span>{selectedTask.id}</span>
                    <span>Due {selectedTask.dueDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">{selectedTask.title}</h3>
                </div>

                {/* Assignee Card */}
                <div className="p-3 bg-white border border-neutral-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                      {selectedTask.assignee.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{selectedTask.assignee.name}</div>
                      <div className="text-neutral-500">{selectedTask.assignee.role}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                    Assigned
                  </span>
                </div>

                {/* AI Note */}
                {selectedTask.aiNote && (
                  <div className="p-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-700 leading-relaxed">
                    <span className="font-semibold text-neutral-900 block mb-1">✨ AI Intelligence</span>
                    {selectedTask.aiNote}
                  </div>
                )}

                {/* Subtask Checklist */}
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2">
                    Subtasks Checklist ({selectedTask.subtasks.filter((s) => s.done).length}/{selectedTask.subtasks.length})
                  </h4>
                  <div className="space-y-1.5">
                    {selectedTask.subtasks.map((st) => (
                      <label
                        key={st.id}
                        onClick={() => handleToggleSubtask(selectedTask.id, st.id)}
                        className="flex items-start gap-2.5 p-2 bg-white border border-neutral-200 rounded-lg text-xs cursor-pointer hover:border-neutral-300 transition"
                      >
                        <input
                          type="checkbox"
                          checked={st.done}
                          onChange={() => {}}
                          className="mt-0.5 accent-neutral-900 rounded cursor-pointer"
                        />
                        <span className={st.done ? 'line-through text-neutral-400' : 'text-neutral-800'}>
                          {st.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-200 text-center text-xs text-neutral-400">
              {PRODUCT_NAME} • Minimalist Workspace
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
