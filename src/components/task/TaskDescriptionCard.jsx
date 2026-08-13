'use client';

import React, { useState, useEffect } from 'react';

export default function TaskDescriptionCard({ description, onSaveDescription }) {
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
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Task Description
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
          >
            <span>✎</span> Edit Description
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            rows={5}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Write detailed specifications, technical details, or notes..."
            className="w-full bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-neutral-900 rounded-xl p-4 text-sm focus:outline-none transition resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setTextInput(description || '');
              }}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition disabled:opacity-50"
            >
              {isSaving ? 'Saving to CognoDB...' : 'Save Description'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="p-4 bg-neutral-50/70 border border-neutral-200 rounded-xl text-sm text-neutral-800 leading-relaxed cursor-pointer hover:border-neutral-300 transition min-h-[90px]"
        >
          {description ? (
            <p className="whitespace-pre-wrap">{description}</p>
          ) : (
            <span className="text-neutral-400 italic">Click to add description...</span>
          )}
        </div>
      )}
    </div>
  );
}
