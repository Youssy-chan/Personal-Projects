'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { HiLockClosed, HiMail } from 'react-icons/hi'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Email o password non corretti')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
            {'</>'}
          </div>
          <h1 className="text-2xl font-bold mb-2">Accedi al pannello admin</h1>
          <p className="text-[#94a3b8] text-sm">
            Inserisci le credenziali per gestire il blog
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#94a3b8] mb-1.5">
              Email
            </label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0d12] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 transition-colors"
                placeholder="admin@blog.dev"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#94a3b8] mb-1.5">
              Password
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0d12] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-glow disabled:opacity-50"
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>

          <p className="text-center text-[#64748b] text-xs mt-4">
            Demo: admin@blog.dev / admin123
          </p>
        </form>
      </div>
    </div>
  )
}
