import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET all builds
router.get('/', requireAuth, async (req, res) => {
  try {
    const builds = await prisma.build.findMany({
      include: {
        customer: true,
        cellLots: true,
        testResults: true,
      },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(builds)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single build
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const build = await prisma.build.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        customer: true,
        cellLots: true,
        testResults: { orderBy: { testedAt: 'desc' } },
      },
    })
    if (!build) return res.status(404).json({ error: 'Build not found' })
    res.json(build)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST new build
router.post('/', requireAuth, async (req, res) => {
  try {
    const { customerId, voltage, cellConfig, quantity, notes, application, nominalCapacity, enclosureType, targetDelivery } = req.body
    const count = await prisma.build.count()
    const build = await prisma.build.create({
      data: {
        buildNumber: `PE-${String(count + 1).padStart(4, '0')}`,
        customerId: parseInt(customerId),
        voltage,
        cellConfig,
        quantity: parseInt(quantity),
        notes,
        application: application || null,
        nominalCapacity: nominalCapacity || null,
        enclosureType: enclosureType || null,
        targetDelivery: targetDelivery ? new Date(targetDelivery) : null,
      },
      include: { customer: true },
    })
    res.json(build)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH build status
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const build = await prisma.build.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status },
    })
    res.json(build)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
