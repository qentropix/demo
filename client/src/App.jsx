import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BuildDetail from './pages/BuildDetail.jsx'
import Report from './pages/Report.jsx'

export default function App() {
  const [auth, setAuth] = useState(null)
  const [session, setSession] = useState({ role: null, customerName: null })

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setAuth(d.authenticated)
        setSession({ role: d.role, customerName: d.customerName })
      })
      .catch(() => setAuth(false))
  }, [])

  function handleLogin(data) {
    setAuth(true)
    setSession({ role: data.role, customerName: data.customerName })
  }

  if (auth === null) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-cyan text-xl">Loading...</div>
    </div>
  )

  const isOperator = session.role === 'operator'

  return (
    <Routes>
      <Route path="/login" element={auth ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
      <Route path="/" element={auth ? <Dashboard isOperator={isOperator} session={session} /> : <Navigate to="/login" />} />
      <Route path="/builds/:id" element={auth ? <BuildDetail isOperator={isOperator} /> : <Navigate to="/login" />} />
      <Route path="/builds/:id/report" element={auth ? <Report /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
