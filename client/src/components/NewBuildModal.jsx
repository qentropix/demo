import React, { useState, useEffect } from 'react'

export default function NewBuildModal({ onClose, onCreated }) {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ customerId: '', voltage: '', cellConfig: '', quantity: '', notes: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/customers', { credentials: 'include' })
      .then(r => r.json())
      .then(setCustomers)
  }, [])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/builds', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    onCreated()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card border border-white/10 rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">New Build</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Customer</label>
            <select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              required
              className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan"
            >
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Voltage</label>
              <input
                name="voltage"
                value={form.voltage}
                onChange={handleChange}
                placeholder="e.g. 48V"
                required
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Quantity</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Units"
                required
                className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Cell Configuration</label>
            <input
              name="cellConfig"
              value={form.cellConfig}
              onChange={handleChange}
              placeholder="e.g. 16S4P — LiFePO4"
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
              rows={2}
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
              {loading ? 'Creating...' : 'Create Build'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
