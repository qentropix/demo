import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// API key middleware
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key']
  if (!key || key !== process.env.INGEST_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' })
  }
  next()
}

// POST /api/ingest/test-result
router.post('/test-result', requireApiKey, async (req, res) => {
  try {
    const { buildNumber, testType, result, notes, technician, testedAt } = req.body
    const build = await prisma.build.findUnique({ where: { buildNumber } })
    if (!build) return res.status(404).json({ error: `Build ${buildNumber} not found` })

    const testResult = await prisma.testResult.create({
      data: {
        buildId: build.id,
        testType,
        result,
        notes: notes || null,
        technician: technician || 'System',
        testedAt: testedAt ? new Date(testedAt) : new Date(),
      },
    })
    res.json({ success: true, testResult })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ingest/status
router.post('/status', requireApiKey, async (req, res) => {
  try {
    const { buildNumber, status } = req.body
    const build = await prisma.build.update({
      where: { buildNumber },
      data: { status },
    })
    res.json({ success: true, build })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ingest/recall
router.post('/recall', requireApiKey, async (req, res) => {
  try {
    const { lotNumber, supplier, severity, message, actionRequired } = req.body
    const recall = await prisma.recall.create({
      data: {
        lotNumber,
        supplier,
        severity: severity || 'HIGH',
        message,
        actionRequired: actionRequired || null,
        issuedAt: new Date(),
        isActive: true,
      },
    })
    res.json({ success: true, recall })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ingest/reset — restore demo to clean seed state
router.post('/reset', requireApiKey, async (req, res) => {
  try {
    // Wipe all recalls and added test results, reset build statuses
    await prisma.recall.deleteMany({})

    // Reset build statuses and remove non-seed test results
    await prisma.build.update({ where: { buildNumber: 'PE-0001' }, data: { status: 'TESTING' } })
    await prisma.build.update({ where: { buildNumber: 'PE-0002' }, data: { status: 'COMPLETE' } })
    await prisma.build.update({ where: { buildNumber: 'PE-0003' }, data: { status: 'IN_PROGRESS' } })
    await prisma.build.update({ where: { buildNumber: 'PE-0004' }, data: { status: 'IN_PROGRESS' } })

    // Remove any test results added after seed (keep only original seed results)
    // Seed results: PE-0001 has 4, PE-0002 has 4, PE-0004 has 1, PE-0003 has 0
    const build1 = await prisma.build.findUnique({ where: { buildNumber: 'PE-0001' } })
    const build2 = await prisma.build.findUnique({ where: { buildNumber: 'PE-0002' } })
    const build3 = await prisma.build.findUnique({ where: { buildNumber: 'PE-0003' } })
    const build4 = await prisma.build.findUnique({ where: { buildNumber: 'PE-0004' } })

    // Delete all test results and cell lots then re-create seed ones
    await prisma.testResult.deleteMany({})
    await prisma.cellLot.deleteMany({})

    // Re-create cell lots
    await prisma.cellLot.createMany({
      data: [
        { buildId: build1.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-12') },
        { buildId: build1.id, lotNumber: 'CATL-2026-0318-B', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-18') },
        { buildId: build1.id, lotNumber: 'CATL-2026-0325-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-25') },
        { buildId: build2.id, lotNumber: 'EVE-2026-0201-A', supplier: 'EVE Energy', quantity: 96, receivedAt: new Date('2026-02-01') },
        { buildId: build2.id, lotNumber: 'EVE-2026-0210-A', supplier: 'EVE Energy', quantity: 96, receivedAt: new Date('2026-02-10') },
        { buildId: build2.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 48, receivedAt: new Date('2026-03-12') },
        { buildId: build3.id, lotNumber: 'SAMSUNG-2026-0401-A', supplier: 'Samsung SDI', quantity: 144, receivedAt: new Date('2026-04-01') },
        { buildId: build4.id, lotNumber: 'CATL-2026-0408-A', supplier: 'CATL', quantity: 20, receivedAt: new Date('2026-04-08') },
      ],
    })

    await prisma.testResult.createMany({
      data: [
        { buildId: build1.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 2mV tolerance', technician: 'John Koch', testedAt: new Date('2026-03-28') },
        { buildId: build1.id, testType: 'Capacity Test', result: 'PASS', notes: '98.4% of rated capacity confirmed', technician: 'John Koch', testedAt: new Date('2026-04-01') },
        { buildId: build1.id, testType: 'Thermal Management', result: 'PASS', notes: 'Max cell delta temp 2.1C under full load', technician: 'John Koch', testedAt: new Date('2026-04-03') },
        { buildId: build1.id, testType: 'BMS Communication', result: 'FAIL', notes: 'CAN bus timeout on unit 7 — under investigation, replacement BMS ordered', technician: 'John Koch', testedAt: new Date('2026-04-07') },
        { buildId: build2.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.5mV tolerance', technician: 'John Koch', testedAt: new Date('2026-02-15') },
        { buildId: build2.id, testType: 'Capacity Test', result: 'PASS', notes: '99.1% of rated capacity — exceeds 72hr runtime spec', technician: 'John Koch', testedAt: new Date('2026-02-18') },
        { buildId: build2.id, testType: 'Thermal Management', result: 'PASS', notes: 'Outdoor enclosure test passed, -20C to +55C range confirmed', technician: 'John Koch', testedAt: new Date('2026-02-20') },
        { buildId: build2.id, testType: 'Functional Test', result: 'PASS', notes: 'Full discharge/charge cycle completed, all 24 units cleared for deployment', technician: 'John Koch', testedAt: new Date('2026-02-22') },
        { buildId: build3.id, testType: 'Cell Matching', result: 'PASS', notes: 'Samsung SDI lot within spec — proceeding to capacity test', technician: 'John Koch', testedAt: new Date('2026-04-05') },
        { buildId: build4.id, testType: 'Cell Matching', result: 'PASS', notes: 'Prototype cells within spec — ready for capacity test', technician: 'John Koch', testedAt: new Date('2026-04-10') },
      ],
    })

    res.json({ success: true, message: 'Demo reset to clean state' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
