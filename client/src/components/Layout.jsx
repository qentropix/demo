import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Layout({ children }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    window.location.replace('/primeenergy/login')
  }

  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-white/10 bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/primeenergy/prime-energy-logo.png"
              alt="Prime Energy Contract Services"
              className="h-8 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="text-white/20">|</div>
            <div className="text-gray-300 text-sm">Build Tracker</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
