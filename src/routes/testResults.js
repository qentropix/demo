import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST add test result to a build
router.post('/', requireAuth, async (req, res) => {
  try {
    const { buildId, testType, result, notes, technician } = req.body
    const testResult = await prisma.testResult.create({
      data: {
        buildId: parseInt(buildId),
        testType,
        result,
        notes,
        technician,
      },
    })
    res.json(testResult)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
