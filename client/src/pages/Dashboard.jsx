import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function Dashboard() {
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewBuild, setShowNewBuild] = useState(false)
  const navigate = useNavigate()

  async function fetchBuilds() {
    const res = await fetch('/api/builds', { credentials: 'include' })
    if (res.status === 401) {
      window.location.href = '/login'
      return
    }
    const data = await res.json()
    setBuilds(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchBuilds() }, [])

  function getTestSummary(build) {
    const total = build.testResults.length
    if (total === 0) return <span className="text-gray-500">No tests yet</span>
    const passed = build.testResults.filter(t => t.result === 'PASS').length
    const failed = total - passed
    return (
      <span className="flex gap-2">
        <span className="text-green-400">{passed} Pass</span>
        {failed > 0 && <span className="text-red-400">{failed} Fail</span>}
      </span>
    )
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Active Builds</h1>
          <p className="text-gray-400 text-sm mt-1">{builds.length} builds tracked</p>
        </div>
        <button
          onClick={() => setShowNewBuild(true)}
          className="bg-cyan text-navy font-semibold px-5 py-2.5 rounded-lg hover:bg-cyan/90 transition text-sm"
        >
          + New Build
        </button>
      </div>

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
              {builds.map((build, i) => (
                <tr
                  key={build.id}
                  onClick={() => navigate(`/builds/${build.id}`)}
                  className={`cursor-pointer hover:bg-white/5 transition border-b border-white/5 ${i === builds.length - 1 ? 'border-b-0' : ''}`}
                >
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
        <NewBuildModal
          onClose={() => setShowNewBuild(false)}
          onCreated={() => { setShowNewBuild(false); fetchBuilds() }}
        />
      )}
    </Layout>
  )
}
