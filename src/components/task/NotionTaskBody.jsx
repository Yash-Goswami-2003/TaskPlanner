'use client';

import React, { useState, useEffect } from 'react';

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export default function NotionTaskBody({ description, onSaveDescription }) {
  const [isEditing, setIsEditing] = useState(false);
  const [textInput, setTextInput] = useState(description || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTextInput(description || '');
  }, [description]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveDescription(textInput);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="py-6 border-b border-zinc-100 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Document Description & Notes
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
          >
            <EditIcon /> Edit Description
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            rows={6}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type task description, technical specifications, or subtask checklists..."
            className="w-full bg-zinc-50/50 text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-lg p-3 text-xs focus:outline-none transition-colors resize-none leading-relaxed"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setTextInput(description || '');
              }}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Description'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="text-xs text-zinc-700 leading-relaxed cursor-pointer hover:bg-zinc-50/50 p-3 -mx-3 rounded-lg transition-colors min-h-[80px]"
        >
          {description ? (
            <div className="whitespace-pre-wrap text-zinc-800 leading-relaxed font-sans">{description}</div>
          ) : (
            <p className="text-zinc-400 italic">
              No description written yet. Click here to start writing task documentation...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
