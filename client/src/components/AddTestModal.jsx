import React, { useState } from 'react'

const TEST_TYPES = [
  'Cell Matching',
  'Capacity Test',
  'Thermal Management',
  'BMS Communication',
  'Functional Test',
  'In-Circuit Test',
  'Environmental Test',
  'Charge/Discharge Cycle',
]

export default function AddTestModal({ buildId, onClose, onAdded }) {
  const [form, setForm] = useState({ testType: '', result: 'PASS', notes: '', technician: 'John Koch' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/test-results', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, buildId }),
    })
    setLoading(false)
    onAdded()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card border border-white/10 rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Add Test Result</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Test Type</label>
            <select
              name="testType"
              value={form.testType}
              onChange={handleChange}
              required
              className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan"
            >
              <option value="">Select test type...</option>
              {TEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Result</label>
            <div className="flex gap-3">
              {['PASS', 'FAIL'].map(r => (
                <label
                  key={r}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer transition ${
                    form.result === r
                      ? r === 'PASS' ? 'border-green-500 bg-green-500/20 text-green-300' : 'border-red-500 bg-red-500/20 text-red-300'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <input type="radio" name="result" value={r} checked={form.result === r} onChange={handleChange} className="hidden" />
                  <span className="font-semibold text-sm">{r}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Technician</label>
            <input
              name="technician"
              value={form.technician}
              onChange={handleChange}
              required
              className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Test observations, measurements, findings..."
              className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/10 text-gray-300 rounded-lg py-2.5 hover:bg-white/5 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan text-navy font-semibold rounded-lg py-2.5 hover:bg-cyan/90 transition text-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
