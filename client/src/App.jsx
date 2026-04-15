import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BuildDetail from './pages/BuildDetail.jsx'
import Report from './pages/Report.jsx'

export default function App() {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setAuth(d.authenticated))
      .catch(() => setAuth(false))
  }, [])

  if (auth === null) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-cyan text-xl">Loading...</div>
    </div>
  )

  return (
    <Routes>
      <Route path="/login" element={auth ? <Navigate to="/" /> : <Login onLogin={() => setAuth(true)} />} />
      <Route path="/" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/builds/:id" element={auth ? <BuildDetail /> : <Navigate to="/login" />} />
      <Route path="/builds/:id/report" element={auth ? <Report /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
