'use client';

import React from 'react';

const UserPlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="17" y1="11" x2="23" y2="11" />
  </svg>
);

const MailIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function TeamMemberList({
  members = [],
  companyName = 'Wexa.ai',
  onOpenCreateEmployee,
  currentUserRole
}) {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 bg-white sticky top-[56px] z-10">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Team Members</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Directory of registered organization members in CognoDB</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-md">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </span>
          {currentUserRole === 'Admin' && (
            <button
              onClick={onOpenCreateEmployee}
              className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-700 text-white px-3.5 py-2 rounded-lg transition-colors active:scale-[0.97] shadow-sm"
            >
              <UserPlusIcon />
              Add Member
            </button>
          )}
        </div>
      </div>

      {/* Member Identity Cards Grid */}
      <div className="flex-1 px-8 py-6">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center">
            <h4 className="text-sm font-semibold text-zinc-700 mb-1">No Team Members Found</h4>
            <p className="text-xs text-zinc-400 max-w-[240px] mb-5 leading-relaxed">
              Add your first employee to assign tasks and collaborate.
            </p>
            {currentUserRole === 'Admin' && (
              <button
                onClick={onOpenCreateEmployee}
                className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                <UserPlusIcon />
                Add Member
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {members.map((member, idx) => {
              const name = member.name || 'User';
              const role = member.role || 'Member';
              const initials = (name || 'US')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();

              return (
                <div
                  key={idx}
                  className="group flex flex-col justify-between p-5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 hover:shadow-sm transition-all"
                >
                  {/* Top Badge & Status */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center ring-4 ring-zinc-50 shadow-2xs">
                        {initials}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>

                    {/* Identity Details */}
                    <h3 className="text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-900">
                      {name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                        {role}
                      </span>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                    <div className="flex items-center gap-1">
                      <ShieldIcon />
                      <span>{companyName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MailIcon />
                      <span className="lowercase">{name.toLowerCase().replace(/\s+/g, '')}@{companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
