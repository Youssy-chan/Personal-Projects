'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, Tag, Post } from '@prisma/client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type PostWithRelations = Post & { tags: Tag[] }

interface Props {
  post?: PostWithRelations
  categories: Category[]
  tags: Tag[]
}

export function PostEditor({ post, categories, tags }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    categoryId: post?.categoryId || categories[0]?.id || '',
    tagIds: post?.tags.map(t => t.id) || [] as string[],
    published: post?.published || false,
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setForm({
      ...form,
      title,
      // Auto-generate slug if not editing an existing post
      slug: !post ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : form.slug
    })
  }

  const toggleTag = (tagId: string) => {
    setForm(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = post ? `/api/posts/${post.id}` : '/api/posts'
      const method = post ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error('Errore nel salvataggio')

      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Errore nel salvataggio del post')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{post ? 'Modifica Articolo' : 'Nuovo Articolo'}</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors"
          >
            {preview ? 'Mostra Editor' : 'Mostra Anteprima'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-glow disabled:opacity-50"
          >
            {loading ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-[#94a3b8] mb-1.5">Titolo</label>
              <input
                required
                value={form.title}
                onChange={handleTitleChange}
                className="w-full bg-[#0a0d12] border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#94a3b8] mb-1.5">Slug URL</label>
              <input
                required
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-[#0a0d12] border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#94a3b8] mb-1.5">Estratto (breve descrizione)</label>
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={e => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-[#0a0d12] border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 resize-none"
              />
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <label className="block text-sm text-[#94a3b8] mb-1.5">Contenuto (Markdown)</label>
            {preview ? (
              <div className="prose max-w-none bg-[#0a0d12] border border-white/10 rounded-lg p-6 min-h-[400px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || '*Nessun contenuto*'}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                required
                rows={20}
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                className="w-full bg-[#0a0d12] border border-white/10 rounded-lg px-4 py-4 text-white font-mono text-sm placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 resize-y"
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="font-semibold border-b border-white/10 pb-3">Pubblicazione</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 rounded bg-[#0a0d12] border-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-[#1a1f2e]"
              />
              <span className="text-sm">Pubblica articolo</span>
            </label>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="font-semibold border-b border-white/10 pb-3">Categoria</h3>
            <select
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className="w-full bg-[#0a0d12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="" disabled>Seleziona una categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="font-semibold border-b border-white/10 pb-3">Tag</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`tag-badge ${form.tagIds.includes(tag.id) ? 'bg-indigo-500/20 border-indigo-500/50 text-white' : ''}`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
