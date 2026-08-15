'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const statusStyles = {
  'To Do': 'bg-zinc-100 text-zinc-600 border-zinc-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'In Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Done: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const priorityStyles = {
  P1: 'bg-red-50 text-red-600 border-red-200',
  P2: 'bg-orange-50 text-orange-600 border-orange-200',
  P3: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  P4: 'bg-zinc-50 text-zinc-500 border-zinc-200'
};

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function toDateOnly(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateKey(date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function isSameDay(first, second) {
  return first && second && toDateKey(first) === toDateKey(second);
}

function isTaskActiveOnDate(task, date) {
  const dueDate = toDateOnly(task.dueDate);
  const startDate = toDateOnly(task.startDate) || dueDate;

  if (!date || !dueDate || !startDate) return false;

  const rangeStart = startDate <= dueDate ? startDate : dueDate;
  const rangeEnd = startDate <= dueDate ? dueDate : startDate;
  return date >= rangeStart && date <= rangeEnd;
}

function getInitialMonth(tasks) {
  const datedTask = tasks.find((task) => toDateOnly(task.startDate) || toDateOnly(task.dueDate));
  const baseDate = toDateOnly(datedTask?.startDate) || toDateOnly(datedTask?.dueDate) || new Date();
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
}

function buildMonthDays(monthDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = addDays(firstDay, -firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      date,
      key: toDateKey(date),
      isCurrentMonth: date.getMonth() === monthDate.getMonth()
    };
  });
}

function getAssigneeNames(tasks, members, currentUserName) {
  const names = new Set();

  members.forEach((member) => {
    if (member.name) names.add(member.name);
  });

  tasks.forEach((task) => {
    (task.assignees || []).forEach((name) => {
      if (name) names.add(name);
    });
  });

  if (currentUserName) names.add(currentUserName);

  return Array.from(names).sort((first, second) => first.localeCompare(second));
}

function TaskSummary({ task }) {
  const status = task.status || 'In Progress';
  const priority = task.priority || 'P1';

  return (
    <div className="p-3 rounded-lg border border-zinc-200 bg-white shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-mono font-semibold text-zinc-400">{task.id}</p>
          <h4 className="text-xs font-semibold text-zinc-900 leading-snug mt-0.5">{task.title}</h4>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md ${statusStyles[status] || statusStyles['In Progress']}`}>
          {status}
        </span>
        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md ${priorityStyles[priority] || priorityStyles.P1}`}>
          {priority}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        {task.startDate || task.dueDate || 'No start date'} to {task.dueDate || task.startDate || 'No due date'}
      </p>
    </div>
  );
}

export default function CalendarView({
  tasks = [],
  members = [],
  user
}) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(user?.userName || 'All Members');
  const [visibleMonth, setVisibleMonth] = useState(() => getInitialMonth(tasks));
  const [selectedDate, setSelectedDate] = useState(() => toDateOnly(new Date()));
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    if (tasks.length === 0) return;

    const nextMonth = getInitialMonth(tasks);
    setVisibleMonth((current) => {
      if (current.getFullYear() === nextMonth.getFullYear() && current.getMonth() === nextMonth.getMonth()) {
        return current;
      }
      return nextMonth;
    });
  }, [tasks]);

  const assigneeNames = useMemo(
    () => getAssigneeNames(tasks, members, user?.userName),
    [tasks, members, user?.userName]
  );

  const filteredTasks = useMemo(() => {
    if (selectedUser === 'All Members') return tasks;
    return tasks.filter((task) => (task.assignees || []).includes(selectedUser));
  }, [tasks, selectedUser]);

  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);

  const tasksByDate = useMemo(() => {
    return monthDays.reduce((acc, day) => {
      acc[day.key] = filteredTasks.filter((task) => isTaskActiveOnDate(task, day.date));
      return acc;
    }, {});
  }, [filteredTasks, monthDays]);

  const focusedDate = hoveredDate || selectedDate;
  const focusedTasks = filteredTasks.filter((task) => isTaskActiveOnDate(task, focusedDate));
  const selectedTasks = filteredTasks.filter((task) => isTaskActiveOnDate(task, selectedDate));

  const handleMonthChange = (offset) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between px-8 py-4 border-b border-zinc-100 bg-white shrink-0">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Calendar</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Track who is working on which task across scheduled dates</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedUser}
            onChange={(event) => setSelectedUser(event.target.value)}
            className="h-9 bg-white border border-zinc-200 rounded-lg px-3 text-xs font-medium text-zinc-700 focus:outline-none focus:border-zinc-900"
          >
            <option value="All Members">All Members</option>
            {assigneeNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-md">
            {filteredTasks.length} scheduled
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 p-8 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden max-w-6xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">{MONTH_FORMATTER.format(visibleMonth)}</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Blue highlights show active task ranges for {selectedUser === 'All Members' ? 'the team' : selectedUser}.
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMonthChange(-1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  aria-label="Previous month"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                    setSelectedDate(toDateOnly(today));
                  }}
                  className="h-8 px-3 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleMonthChange(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  aria-label="Next month"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-zinc-100 bg-zinc-50">
              {DAY_LABELS.map((day) => (
                <div key={day} className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {monthDays.map((day) => {
                const dayTasks = tasksByDate[day.key] || [];
                const isSelected = isSameDay(day.date, selectedDate);
                const isToday = isSameDay(day.date, new Date());

                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setSelectedDate(day.date)}
                    onMouseEnter={() => setHoveredDate(day.date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    title={dayTasks.length ? dayTasks.map((task) => task.title).join('\n') : 'No scheduled tasks'}
                    className={`group relative min-h-[104px] border-r border-b border-zinc-100 p-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-900 ${
                      dayTasks.length ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'bg-white hover:bg-zinc-50'
                    } ${!day.isCurrentMonth ? 'opacity-45' : ''} ${isSelected ? 'ring-2 ring-inset ring-blue-500' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                        isToday ? 'bg-zinc-900 text-white' : dayTasks.length ? 'text-blue-800' : 'text-zinc-500'
                      }`}>
                        {day.date.getDate()}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-[10px] font-mono text-blue-700 bg-white/80 border border-blue-100 px-1.5 py-0.5 rounded">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div key={task.id} className="truncate rounded bg-blue-600/15 px-2 py-1 text-[10px] font-semibold text-blue-900">
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-[10px] font-semibold text-blue-700 px-1">+{dayTasks.length - 2} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="bg-white border-l border-zinc-100 p-5 overflow-y-auto">
          <div className="sticky top-0 space-y-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Selected Date</p>
              <h3 className="text-sm font-semibold text-zinc-900 mt-1">
                {selectedDate ? DATE_FORMATTER.format(selectedDate) : 'Choose a date'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {selectedTasks.length
                  ? `${selectedTasks.length} task${selectedTasks.length === 1 ? '' : 's'} scheduled`
                  : 'No scheduled work for this date'}
              </p>
            </div>

            <div className="space-y-2">
              {selectedTasks.length ? (
                selectedTasks.map((task) => (
                  <button
                    type="button"
                    key={task.id}
                    onClick={() => router.push(`/task/${task.id}`)}
                    className="w-full text-left"
                  >
                    <TaskSummary task={task} />
                  </button>
                ))
              ) : (
                <div className="border border-dashed border-zinc-200 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-zinc-600">Clear day</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Pick another highlighted date to see task details.</p>
                </div>
              )}
            </div>

            {hoveredDate && !isSameDay(hoveredDate, selectedDate) && (
              <div className="pt-4 border-t border-zinc-100">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Hover Preview</p>
                <h4 className="text-xs font-semibold text-zinc-900 mt-1">{DATE_FORMATTER.format(hoveredDate)}</h4>
                <div className="mt-2 space-y-2">
                  {focusedTasks.length ? (
                    focusedTasks.slice(0, 3).map((task) => <TaskSummary key={task.id} task={task} />)
                  ) : (
                    <p className="text-[11px] text-zinc-400">No task scheduled on this date.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
