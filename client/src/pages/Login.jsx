import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        onLogin()
      } else {
        setError('Invalid username or password')
      }
    } catch {
      setError('Connection error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-cyan text-3xl font-bold tracking-wide">Q<span className="text-gray-300 font-normal">entropix</span></div>
          <div className="text-gray-400 text-sm mt-1 tracking-widest uppercase">Demo Portal</div>
        </div>
        <div className="bg-card rounded-xl p-8 shadow-2xl border border-white/5">
          <div className="mb-6">
            <div className="text-white font-semibold text-lg">Prime Energy Build Tracker</div>
            <div className="text-gray-400 text-sm mt-1">Sign in to continue</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan"
              />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan text-navy font-semibold rounded-lg py-2.5 hover:bg-cyan/90 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <div className="text-center text-gray-600 text-xs mt-6">Powered by Qentropix</div>
      </div>
    </div>
  )
}
