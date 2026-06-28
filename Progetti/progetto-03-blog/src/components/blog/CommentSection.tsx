'use client'

import { useState } from 'react'
import type { Comment } from '@prisma/client'
import { HiUser, HiClock } from 'react-icons/hi'

interface Props {
  postId: string
  comments: Comment[]
}

export function CommentSection({ postId, comments }: Props) {
  const [form, setForm] = useState({ authorName: '', authorEmail: '', content: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, postId }),
      })

      if (!res.ok) throw new Error('Errore nell\'invio')

      setStatus('success')
      setForm({ authorName: '', authorEmail: '', content: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        Commenti <span className="text-[#64748b]">({comments.length})</span>
      </h2>

      {/* Comments list */}
      <div className="space-y-4 mb-10">
        {comments.map((comment) => (
          <div key={comment.id} className="glass rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <HiUser size={16} />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">{comment.authorName}</p>
                <p className="text-xs text-[#64748b] flex items-center gap-1">
                  <HiClock size={12} />
                  {new Intl.DateTimeFormat('it-IT', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(comment.createdAt))}
                </p>
              </div>
            </div>
            <p className="text-[#94a3b8] text-sm leading-relaxed">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-[#64748b] text-sm">Nessun commento ancora. Sii il primo!</p>
        )}
      </div>

      {/* Comment form */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-bold mb-4">Lascia un commento</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="authorName" className="block text-sm text-[#94a3b8] mb-1.5">Nome</label>
              <input
                id="authorName"
                required
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="w-full bg-[#0a0d12] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 transition-colors"
                placeholder="Il tuo nome"
              />
            </div>
            <div>
              <label htmlFor="authorEmail" className="block text-sm text-[#94a3b8] mb-1.5">Email</label>
              <input
                id="authorEmail"
                type="email"
                required
                value={form.authorEmail}
                onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
                className="w-full bg-[#0a0d12] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 transition-colors"
                placeholder="La tua email (non pubblicata)"
              />
            </div>
          </div>
          <div>
            <label htmlFor="commentContent" className="block text-sm text-[#94a3b8] mb-1.5">Commento</label>
            <textarea
              id="commentContent"
              required
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-[#0a0d12] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
              placeholder="Scrivi il tuo commento..."
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Invio...' : 'Pubblica commento'}
          </button>
          {status === 'success' && (
            <p className="text-emerald-400 text-sm">✓ Commento inviato! Sarà visibile dopo l&apos;approvazione.</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm">✗ Errore nell&apos;invio. Riprova.</p>
          )}
        </form>
      </div>
    </section>
  )
}
