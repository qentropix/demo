import React, { useState, useEffect } from 'react'

const APPLICATIONS = ['Forklift', 'UPS / Backup Power', 'Telecom Backup', 'Marine', 'Solar Storage', 'EV Conversion', 'Custom']
const ENCLOSURE_TYPES = ['Standard', 'IP54', 'IP65', 'IP67', 'IP68']

export default function NewBuildModal({ onClose, onCreated }) {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({
    customerId: '',
    voltage: '',
    cellConfig: '',
    quantity: '',
    application: '',
    nominalCapacity: '',
    enclosureType: '',
    targetDelivery: '',
    notes: '',
  })
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

  const inputClass = 'w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan text-sm'
  const labelClass = 'block text-xs text-gray-400 mb-1 uppercase tracking-wider'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-white/10 rounded-xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">New Build</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Customer */}
          <div>
            <label className={labelClass}>Customer</label>
            <select name="customerId" value={form.customerId} onChange={handleChange} required className={inputClass}>
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Application */}
          <div>
            <label className={labelClass}>Application</label>
            <select name="application" value={form.application} onChange={handleChange} className={inputClass}>
              <option value="">Select application...</option>
              {APPLICATIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Voltage + Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Voltage</label>
              <input name="voltage" value={form.voltage} onChange={handleChange} placeholder="e.g. 48V" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nominal Capacity</label>
              <input name="nominalCapacity" value={form.nominalCapacity} onChange={handleChange} placeholder="e.g. 100Ah" className={inputClass} />
            </div>
          </div>

          {/* Cell Config */}
          <div>
            <label className={labelClass}>Cell Configuration</label>
            <input name="cellConfig" value={form.cellConfig} onChange={handleChange} placeholder="e.g. 16S4P — LiFePO4" required className={inputClass} />
          </div>

          {/* Quantity + Enclosure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Quantity (units)</label>
              <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Units" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Enclosure Rating</label>
              <select name="enclosureType" value={form.enclosureType} onChange={handleChange} className={inputClass}>
                <option value="">Select rating...</option>
                {ENCLOSURE_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Target Delivery */}
          <div>
            <label className={labelClass}>Target Delivery</label>
            <input name="targetDelivery" type="date" value={form.targetDelivery} onChange={handleChange} className={inputClass} />
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-white/10 text-gray-300 rounded-lg py-2.5 hover:bg-white/5 transition text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-cyan text-navy font-semibold rounded-lg py-2.5 hover:bg-cyan/90 transition text-sm disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Build'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
