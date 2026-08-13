'use client';

import React from 'react';

export default function TaskAssigneesCard({ assignees = [] }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
        Assigned To ({assignees.length})
      </h3>

      <div className="flex flex-wrap gap-2.5">
        {assignees.length === 0 ? (
          <p className="text-xs text-neutral-400 italic">No team members assigned.</p>
        ) : (
          assignees.map((empName, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 bg-neutral-50 border border-neutral-200 px-3.5 py-2 rounded-xl text-xs shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                {empName.substring(0, 1).toUpperCase()}
              </div>
              <span className="font-semibold text-neutral-900">{empName}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
