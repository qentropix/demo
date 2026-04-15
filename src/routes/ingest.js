import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { BUILD_STATUSES, getCellLots, getTestResults } from '../lib/seedData.js'

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
    // Wipe dynamic data
    await prisma.recall.deleteMany({})
    await prisma.testResult.deleteMany({})
    await prisma.cellLot.deleteMany({})

    // Reset all build statuses
    await Promise.all(Object.entries(BUILD_STATUSES).map(([buildNumber, status]) =>
      prisma.build.update({ where: { buildNumber }, data: { status } })
    ))

    // Fetch all builds to get IDs
    const allBuilds = await prisma.build.findMany({ select: { id: true, buildNumber: true } })
    const buildMap = Object.fromEntries(allBuilds.map(b => [b.buildNumber, b.id]))

    // Re-create cell lots and test results
    await prisma.cellLot.createMany({ data: getCellLots(buildMap) })
    await prisma.testResult.createMany({ data: getTestResults(buildMap) })

    res.json({ success: true, message: 'Demo reset to clean state — all 29 builds restored' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
