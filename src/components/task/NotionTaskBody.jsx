'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="py-6 border-b border-neutral-200 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Document Description & Notes
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
          >
            <span>✎</span> Edit Document
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            rows={8}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type task description, technical notes, specification blocks, or subtask checklists..."
            className="w-full bg-transparent text-neutral-900 focus:outline-none transition leading-relaxed resize-none font-sans text-sm p-0 border-0"
          />
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
            <button
              onClick={() => {
                setIsEditing(false);
                setTextInput(description || '');
              }}
              className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Description'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="text-sm text-neutral-800 leading-relaxed cursor-pointer hover:bg-neutral-50/50 p-2 -mx-2 rounded transition min-h-[90px]"
        >
          {description ? (
            <div className="whitespace-pre-wrap font-sans text-neutral-800 leading-relaxed">{description}</div>
          ) : (
            <p className="text-neutral-400 italic">
              No description written yet. Click here to start writing task documentation...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
