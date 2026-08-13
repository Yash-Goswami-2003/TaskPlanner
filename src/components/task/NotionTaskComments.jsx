'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="pt-6 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Discussion ({comments.length})
        </h2>
        <span className="text-[10px] font-mono text-neutral-400">[:COMMENTED_ON]</span>
      </div>

      {/* Unboxed Comment Stream */}
      <div className="space-y-5">
        {comments.length === 0 ? (
          <p className="text-xs text-neutral-400 italic">
            No discussion comments yet. Type a comment below to start the conversation!
          </p>
        ) : (
          comments.map((c, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">
                    {c.author.substring(0, 1).toUpperCase()}
                  </span>
                  <span className="font-semibold text-neutral-900">{c.author}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {new Date(c.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed pl-7">{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Unboxed Minimalist Line Input Bar */}
      <form onSubmit={handlePostComment} className="flex items-center gap-3 pt-3 border-t border-neutral-100">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment to this document..."
          className="flex-1 bg-transparent text-neutral-900 placeholder-neutral-400 border-b border-neutral-200 focus:border-neutral-900 py-2 text-xs focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isPosting}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition disabled:opacity-40"
        >
          {isPosting ? 'Posting...' : 'Comment'}
        </button>
      </form>
    </div>
  );
}
