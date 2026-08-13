'use client';

import React, { useState, useEffect } from 'react';

function formatCommentDate(dateVal) {
  if (!dateVal) return 'Just now';
  try {
    const d = new Date(typeof dateVal === 'number' ? dateVal : dateVal);
    if (isNaN(d.getTime())) return 'Just now';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Just now';
  }
}

export default function NotionTaskComments({ taskId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (taskId) {
      fetch(`/api/tasks/comments?taskId=${taskId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.comments) setComments(data.comments);
        })
        .catch(() => {});
    }
  }, [taskId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isPosting || !taskId) return;

    setIsPosting(true);
    try {
      const token = localStorage.getItem('task_planner_token');
      const res = await fetch('/api/tasks/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskId,
          content: newComment.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.comment) {
        setComments([...comments, data.comment]);
        setNewComment('');
      }
    } catch (err) {
      setComments([
        ...comments,
        { author: currentUser?.userName || 'You', content: newComment.trim(), createdAt: Date.now() }
      ]);
      setNewComment('');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="pt-6 space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <h2 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Discussion ({comments.length})
        </h2>
        <span className="text-[10px] font-mono text-zinc-400">[:COMMENTED_ON]</span>
      </div>

      {/* Comment Stream */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">
            No discussion comments yet. Add a comment below to start the conversation!
          </p>
        ) : (
          comments.map((c, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[9px] flex items-center justify-center font-bold">
                    {(c.author || 'A').substring(0, 1).toUpperCase()}
                  </div>
                  <span className="font-semibold text-zinc-900 text-xs">{c.author || 'Anonymous'}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {formatCommentDate(c.createdAt)}
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed pl-7">{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handlePostComment} className="flex items-center gap-2.5 pt-3 border-t border-zinc-100">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment to this task..."
          className="flex-1 bg-zinc-50/50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 placeholder-zinc-400 rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isPosting}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-40"
        >
          {isPosting ? 'Posting...' : 'Comment'}
        </button>
      </form>
    </div>
  );
}
