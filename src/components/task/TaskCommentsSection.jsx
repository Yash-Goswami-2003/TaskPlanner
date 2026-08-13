'use client';

import React, { useState, useEffect } from 'react';

export default function TaskCommentsSection({ taskId, currentUser }) {
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
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Discussion & Team Comments ({comments.length})
        </h3>
        <span className="text-[10px] font-mono text-neutral-400">[:COMMENTED_ON]</span>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-neutral-400 italic py-2">No comments yet. Write a comment to discuss this task with your team!</p>
        ) : (
          comments.map((c, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">
                    {c.author.substring(0, 1).toUpperCase()}
                  </span>
                  <span>{c.author}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono font-normal">
                  {new Date(c.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-neutral-700 leading-relaxed pl-7">{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment to this task..."
          className="flex-1 bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-4 py-3 text-xs focus:outline-none transition shadow-2xs"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isPosting}
          className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-2xs disabled:opacity-40"
        >
          {isPosting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}
