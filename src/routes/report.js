import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET full report for a build
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const build = await prisma.build.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        customer: true,
        cellLots: true,
        testResults: { orderBy: { testedAt: 'asc' } },
      },
    })
    if (!build) return res.status(404).json({ error: 'Build not found' })

    const passed = build.testResults.filter(t => t.result === 'PASS').length
    const failed = build.testResults.filter(t => t.result === 'FAIL').length

    res.json({
      reportGeneratedAt: new Date(),
      build,
      summary: {
        totalTests: build.testResults.length,
        passed,
        failed,
        cellLots: build.cellLots.length,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
