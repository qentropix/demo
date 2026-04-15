import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET active recalls with affected builds
router.get('/', requireAuth, async (req, res) => {
  try {
    const recalls = await prisma.recall.findMany({
      where: { isActive: true },
      orderBy: { issuedAt: 'desc' },
    })

    const result = await Promise.all(recalls.map(async (recall) => {
      const affectedLots = await prisma.cellLot.findMany({
        where: { lotNumber: recall.lotNumber },
        include: {
          build: {
            include: { customer: true },
          },
        },
      })

      const affectedBuilds = affectedLots.map(lot => ({
        buildId: lot.build.id,
        buildNumber: lot.build.buildNumber,
        customerName: lot.build.customer.name,
        status: lot.build.status,
      }))

      return { ...recall, affectedBuilds }
    }))

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
