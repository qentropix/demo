import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Layout from '../components/Layout.jsx'
import NewBuildModal from '../components/NewBuildModal.jsx'

const STATUS_COLORS = {
  IN_PROGRESS: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  TESTING:     'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  COMPLETE:    'bg-green-500/20 text-green-300 border-green-500/30',
  ON_HOLD:     'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

const STATUS_LABELS = {
  IN_PROGRESS: 'In Progress',
  TESTING:     'Testing',
  COMPLETE:    'Complete',
  ON_HOLD:     'On Hold',
}

const STATUS_CHART_COLORS = {
  IN_PROGRESS: '#3b82f6',
  TESTING:     '#eab308',
  COMPLETE:    '#22c55e',
  ON_HOLD:     '#6b7280',
}

const APPLICATIONS = ['Forklift', 'UPS / Backup Power', 'Telecom Backup', 'Marine', 'Solar Storage', 'EV Conversion', 'Custom']

const APP_COLORS = {
  'Forklift':          '#06b6d4',
  'UPS/Backup':        '#8b5cf6',
  'Telecom Backup':    '#f59e0b',
  'Marine':            '#3b82f6',
  'Solar Storage':     '#22c55e',
  'EV Conversion':     '#f97316',
  'Custom':            '#ec4899',
}

export default function Dashboard({ isOperator = true, session = {} }) {
  const [builds, setBuilds] = useState([])
  const [recalls, setRecalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewBuild, setShowNewBuild] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [appFilter, setAppFilter] = useState('')
  const [search, setSearch] = useState('')
  const [toasts, setToasts] = useState([])
  const knownBuildIds = React.useRef(null)
  const navigate = useNavigate()

  function addToast(message) {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }

  async function fetchBuilds() {
    const res = await fetch('/api/builds', { credentials: 'include' })
    if (res.status === 401) { navigate('/login'); return }
    const data = await res.json()
    const incoming = Array.isArray(data) ? data : []
    if (knownBuildIds.current !== null) {
      const newBuilds = incoming.filter(b => !knownBuildIds.current.has(b.id))
      newBuilds.forEach(b => addToast(`New order received — ${b.buildNumber} (${b.customer?.name})`))
    }
    knownBuildIds.current = new Set(incoming.map(b => b.id))
    setBuilds(incoming)
    setLoading(false)
  }

  async function fetchRecalls() {
    const res = await fetch('/api/recalls', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setRecalls(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchBuilds()
    fetchRecalls()
    const interval = setInterval(() => { fetchBuilds(); fetchRecalls() }, 5000)
    return () => clearInterval(interval)
  }, [])

  // ── Derived stats ──────────────────────────────────────────────────────────
  const statusCounts = useMemo(() => {
    const counts = { IN_PROGRESS: 0, TESTING: 0, COMPLETE: 0, ON_HOLD: 0 }
    builds.forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++ })
    return counts
  }, [builds])

  const statusChartData = useMemo(() =>
    Object.entries(statusCounts)
      .filter(([, v]) => v > 0)
      .map(([key, value]) => ({ name: STATUS_LABELS[key], value, color: STATUS_CHART_COLORS[key] }))
  , [statusCounts])

  const appChartData = useMemo(() => {
    const counts = {}
    builds.forEach(b => {
      if (b.application) counts[b.application] = (counts[b.application] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name: name === 'UPS / Backup Power' ? 'UPS/Backup' : name, count }))
  }, [builds])

  const passRate = useMemo(() => {
    const allTests = builds.flatMap(b => b.testResults)
    if (!allTests.length) return null
    const passed = allTests.filter(t => t.result === 'PASS').length
    return Math.round((passed / allTests.length) * 100)
  }, [builds])

  // ── Filtered builds ────────────────────────────────────────────────────────
  const filtered = useMemo(() => builds.filter(b => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false
    if (appFilter && b.application !== appFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!b.buildNumber.toLowerCase().includes(q) && !b.customer.name.toLowerCase().includes(q)) return false
    }
    return true
  }), [builds, statusFilter, appFilter, search])

  function getTestSummary(build) {
    const total = build.testResults.length
    if (total === 0) return <span className="text-gray-500 text-sm">No tests yet</span>
    const passed = build.testResults.filter(t => t.result === 'PASS').length
    const failed = total - passed
    return (
      <span className="flex gap-2 text-sm">
        <span className="text-green-400">{passed} Pass</span>
        {failed > 0 && <span className="text-red-400">{failed} Fail</span>}
      </span>
    )
  }

  const STATUS_TABS = ['ALL', 'IN_PROGRESS', 'TESTING', 'COMPLETE', 'ON_HOLD']
  const TAB_LABELS = { ALL: 'All', ...STATUS_LABELS }

  return (
    <Layout>
      {/* Recall Alerts */}
      {recalls.filter(r => r.affectedBuilds.length > 0).map(recall => (
        <div key={recall.id} className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-red-400 text-lg mt-0.5">⚠</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-red-400 font-semibold text-sm">Supplier Safety Notice</span>
                <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">{recall.severity}</span>
                <span className="text-xs text-gray-500">{new Date(recall.issuedAt).toLocaleDateString()}</span>
              </div>
              <div className="text-white font-medium mb-1">{recall.supplier} — Lot {recall.lotNumber}</div>
              <div className="text-gray-300 text-sm mb-2">{recall.message}</div>
              {recall.actionRequired && (
                <div className="text-yellow-300 text-sm mb-3"><span className="font-semibold">Action Required:</span> {recall.actionRequired}</div>
              )}
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 text-xs mt-1">Affected builds:</span>
                {recall.affectedBuilds.map(b => (
                  <button key={b.buildId} onClick={() => navigate(`/builds/${b.buildId}`)}
                    className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full hover:bg-red-500/30 transition">
                    {b.buildNumber} — {b.customerName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isOperator ? 'Active Builds' : `${session.customerName} — Your Builds`}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isOperator
              ? `${builds.length} builds tracked across ${new Set(builds.map(b => b.customer?.name)).size} customers`
              : `${builds.length} build${builds.length !== 1 ? 's' : ''} — read-only view`}
          </p>
        </div>
        {isOperator && (
          <button onClick={() => setShowNewBuild(true)}
            className="bg-cyan text-navy font-semibold px-5 py-2.5 rounded-lg hover:bg-cyan/90 transition text-sm">
            + New Build
          </button>
        )}
      </div>

      {/* Stats + Charts */}
      {!loading && builds.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Status donut */}
          <div className="col-span-1 bg-card rounded-xl border border-white/5 p-5">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">By Status</div>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={2}>
                  {statusChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {statusChartData.map(s => (
                <div key={s.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-gray-400 text-xs">{s.name}: {s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application bar chart */}
          <div className="col-span-2 bg-card rounded-xl border border-white/5 p-5">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Builds by Application</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={appChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {appChartData.map((entry, i) => (
                    <Cell key={i} fill={APP_COLORS[entry.name] || '#06b6d4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats cards */}
          <div className="col-span-1 flex flex-col gap-3">
            <div className="bg-card rounded-xl border border-white/5 p-4 flex-1">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Test Pass Rate</div>
              <div className={`text-3xl font-bold ${passRate >= 90 ? 'text-green-400' : passRate >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                {passRate !== null ? `${passRate}%` : '—'}
              </div>
              <div className="text-gray-500 text-xs mt-1">across all builds</div>
            </div>
            <div className="bg-card rounded-xl border border-white/5 p-4 flex-1">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">In Testing</div>
              <div className="text-3xl font-bold text-yellow-400">{statusCounts.TESTING}</div>
              <div className="text-gray-500 text-xs mt-1">{statusCounts.IN_PROGRESS} in progress</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Status tabs */}
        <div className="flex bg-card rounded-lg border border-white/5 p-1 gap-1">
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                statusFilter === s ? 'bg-cyan text-navy' : 'text-gray-400 hover:text-white'
              }`}>
              {TAB_LABELS[s]}
              {s !== 'ALL' && statusCounts[s] > 0 && (
                <span className={`ml-1.5 text-xs ${statusFilter === s ? 'text-navy/70' : 'text-gray-600'}`}>
                  {statusCounts[s]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Application filter */}
        <select value={appFilter} onChange={e => setAppFilter(e.target.value)}
          className="bg-card border border-white/10 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-cyan">
          <option value="">All Applications</option>
          {APPLICATIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search build or customer..."
          className="bg-card border border-white/10 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-cyan w-52 placeholder-gray-600"
        />

        {(statusFilter !== 'ALL' || appFilter || search) && (
          <button onClick={() => { setStatusFilter('ALL'); setAppFilter(''); setSearch('') }}
            className="text-xs text-gray-500 hover:text-gray-300 transition">
            Clear filters
          </button>
        )}

        <span className="text-gray-600 text-xs ml-auto">{filtered.length} of {builds.length} builds</span>
      </div>

      {/* Builds Table */}
      {loading ? (
        <div className="text-gray-400">Loading builds...</div>
      ) : (
        <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Build</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Config</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cell Lots</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Test Results</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">No builds match the current filters</td></tr>
              ) : filtered.map((build, i) => (
                <tr key={build.id} onClick={() => navigate(`/builds/${build.id}`)}
                  className={`cursor-pointer hover:bg-white/5 transition border-b border-white/5 ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-cyan">{build.buildNumber}</div>
                    <div className="text-gray-500 text-xs mt-0.5">Qty: {build.quantity}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{build.customer.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300">{build.voltage}{build.nominalCapacity ? ` · ${build.nominalCapacity}` : ''}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{build.cellConfig}</div>
                    {build.application && <div className="text-gray-600 text-xs mt-0.5">{build.application}</div>}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{build.cellLots.length} lot{build.cellLots.length !== 1 ? 's' : ''}</td>
                  <td className="px-6 py-4">{getTestSummary(build)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLORS[build.status]}`}>
                      {STATUS_LABELS[build.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNewBuild && (
        <NewBuildModal onClose={() => setShowNewBuild(false)} onCreated={() => { setShowNewBuild(false); fetchBuilds() }} />
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {toasts.map(t => (
          <div key={t.id} className="bg-cyan text-navy font-semibold px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-3 animate-fade-in">
            <span>📋</span>
            {t.message}
          </div>
        ))}
      </div>
    </Layout>
  )
}
