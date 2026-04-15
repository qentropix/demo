import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Report() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)

  useEffect(() => {
    fetch(`/api/report/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(setReport)
  }, [id])

  if (!report) return <div className="p-8 text-gray-400">Loading report...</div>

  const { build, summary, reportGeneratedAt } = report

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8 print:p-6">
      {/* Print/Back controls — hidden when printing */}
      <div className="flex gap-3 mb-8 print:hidden">
        <button
          onClick={() => navigate(`/builds/${id}`)}
          className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
        >
          ← Back to Build
        </button>
        <button
          onClick={() => window.print()}
          className="bg-[#0D1B2A] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#1A2E44] transition"
        >
          Print / Save PDF
        </button>
      </div>

      {/* Report Header */}
      <div className="flex items-start justify-between border-b-2 border-gray-900 pb-6 mb-8">
        <div>
          <div className="text-2xl font-bold text-[#0D1B2A]">Q<span className="font-normal text-gray-500">entropix</span></div>
          <div className="text-gray-400 text-xs tracking-widest uppercase mt-0.5">Build Tracker Report</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Report Generated</div>
          <div className="text-sm font-medium">{new Date(reportGeneratedAt).toLocaleString()}</div>
        </div>
      </div>

      {/* Build Summary */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">{build.buildNumber}</h1>
        <div className="text-gray-600 text-lg mb-6">{build.customer.name}</div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            ['Voltage',       build.voltage],
            ['Cell Config',   build.cellConfig],
            ['Quantity',      `${build.quantity} units`],
            ['Status',        build.status.replace('_', ' ')],
          ].map(([label, value]) => (
            <div key={label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</div>
              <div className="font-semibold text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        {build.notes && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Notes</div>
            <div className="text-gray-700">{build.notes}</div>
          </div>
        )}
      </div>

      {/* Cell Lots */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Cell Lots ({summary.cellLots})</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-2 text-gray-500 font-medium">Lot Number</th>
              <th className="pb-2 text-gray-500 font-medium">Supplier</th>
              <th className="pb-2 text-gray-500 font-medium">Quantity</th>
              <th className="pb-2 text-gray-500 font-medium">Received</th>
            </tr>
          </thead>
          <tbody>
            {build.cellLots.map(lot => (
              <tr key={lot.id} className="border-b border-gray-100">
                <td className="py-2.5 font-mono text-[#0D1B2A]">{lot.lotNumber}</td>
                <td className="py-2.5 text-gray-700">{lot.supplier}</td>
                <td className="py-2.5 text-gray-700">{lot.quantity} cells</td>
                <td className="py-2.5 text-gray-500">{new Date(lot.receivedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Test Results */}
      <div className="mb-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-bold">Test Results ({summary.totalTests})</h2>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">{summary.passed} Passed</span>
            {summary.failed > 0 && <span className="text-red-600 font-medium">{summary.failed} Failed</span>}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-2 text-gray-500 font-medium">Test Type</th>
              <th className="pb-2 text-gray-500 font-medium">Result</th>
              <th className="pb-2 text-gray-500 font-medium">Notes</th>
              <th className="pb-2 text-gray-500 font-medium">Technician</th>
              <th className="pb-2 text-gray-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {build.testResults.map(t => (
              <tr key={t.id} className="border-b border-gray-100">
                <td className="py-2.5 font-medium text-gray-900">{t.testType}</td>
                <td className="py-2.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${t.result === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.result}
                  </span>
                </td>
                <td className="py-2.5 text-gray-500 max-w-xs">{t.notes || '—'}</td>
                <td className="py-2.5 text-gray-600">{t.technician}</td>
                <td className="py-2.5 text-gray-500">{new Date(t.testedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 text-xs text-gray-400 flex justify-between">
        <div>Generated by Qentropix Build Tracker</div>
        <div>Confidential — {build.customer.name}</div>
      </div>
    </div>
  )
}
