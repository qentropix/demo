import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import AddTestModal from '../components/AddTestModal.jsx'

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

export default function BuildDetail({ isOperator = true }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [build, setBuild] = useState(null)
  const [showAddTest, setShowAddTest] = useState(false)

  async function fetchBuild() {
    const res = await fetch(`/api/builds/${id}`, { credentials: 'include' })
    const data = await res.json()
    setBuild(data)
  }

  useEffect(() => { fetchBuild() }, [id])

  if (!build) return (
    <Layout>
      <div className="text-gray-400">Loading build...</div>
    </Layout>
  )

  const passed = build.testResults.filter(t => t.result === 'PASS').length
  const failed = build.testResults.filter(t => t.result === 'FAIL').length

  return (
    <Layout>
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white text-sm transition mb-4 flex items-center gap-1"
        >
          ← Back to Builds
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{build.buildNumber}</h1>
            <p className="text-gray-400 mt-1">{build.customer.name}</p>
          </div>
          <div className="flex items-center gap-3">
            {!isOperator && (
              <span className="text-xs text-gray-500 border border-white/10 px-3 py-1.5 rounded-full">
                Read-only
              </span>
            )}
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${STATUS_COLORS[build.status]}`}>
              {STATUS_LABELS[build.status]}
            </span>
            <button
              onClick={() => navigate(`/builds/${id}/report`)}
              className="bg-card border border-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Application</div>
          <div className="text-white font-semibold">{build.application || '—'}</div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Voltage</div>
          <div className="text-white font-semibold text-xl">{build.voltage}</div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Capacity</div>
          <div className="text-white font-semibold">{build.nominalCapacity || '—'}</div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Quantity</div>
          <div className="text-white font-semibold text-xl">{build.quantity} units</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Cell Config</div>
          <div className="text-white font-semibold">{build.cellConfig}</div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Enclosure Rating</div>
          <div className="text-white font-semibold">{build.enclosureType || '—'}</div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Target Delivery</div>
          <div className="text-white font-semibold">{build.targetDelivery ? new Date(build.targetDelivery).toLocaleDateString() : '—'}</div>
        </div>
      </div>

      {build.notes && (
        <div className="bg-card rounded-xl p-5 border border-white/5 mb-8">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Notes</div>
          <div className="text-gray-300">{build.notes}</div>
        </div>
      )}

      {/* Cell Lots */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Cell Lots <span className="text-gray-500 text-sm font-normal">({build.cellLots.length})</span></h2>
        {build.cellLots.length === 0 ? (
          <div className="text-gray-500 text-sm">No cell lots assigned yet.</div>
        ) : (
          <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Lot Number</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Received</th>
                </tr>
              </thead>
              <tbody>
                {build.cellLots.map((lot, i) => (
                  <tr key={lot.id} className={`border-b border-white/5 ${i === build.cellLots.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-6 py-3 text-cyan font-mono text-sm">{lot.lotNumber}</td>
                    <td className="px-6 py-3 text-gray-300">{lot.supplier}</td>
                    <td className="px-6 py-3 text-gray-300">{lot.quantity} cells</td>
                    <td className="px-6 py-3 text-gray-400 text-sm">{new Date(lot.receivedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Test Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Test Results <span className="text-gray-500 text-sm font-normal">({build.testResults.length})</span></h2>
            {build.testResults.length > 0 && (
              <div className="flex gap-3 text-sm">
                <span className="text-green-400">{passed} Pass</span>
                {failed > 0 && <span className="text-red-400">{failed} Fail</span>}
              </div>
            )}
          </div>
          {isOperator && (
            <button
              onClick={() => setShowAddTest(true)}
              className="bg-cyan text-navy font-semibold px-4 py-2 rounded-lg hover:bg-cyan/90 transition text-sm"
            >
              + Add Test Result
            </button>
          )}
        </div>

        {build.testResults.length === 0 ? (
          <div className="text-gray-500 text-sm">No test results yet.</div>
        ) : (
          <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Test Type</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {build.testResults.map((t, i) => (
                  <tr key={t.id} className={`border-b border-white/5 ${i === build.testResults.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-6 py-3 text-gray-300 font-medium">{t.testType}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.result === 'PASS' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {t.result}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-sm max-w-xs">{t.notes || '—'}</td>
                    <td className="px-6 py-3 text-gray-400 text-sm">{t.technician}</td>
                    <td className="px-6 py-3 text-gray-400 text-sm">{new Date(t.testedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddTest && (
        <AddTestModal
          buildId={id}
          onClose={() => setShowAddTest(false)}
          onAdded={() => { setShowAddTest(false); fetchBuild() }}
        />
      )}
    </Layout>
  )
}
