import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

const DEMO_USER = process.env.DEMO_USERNAME || 'demo'
const DEMO_PASS = process.env.DEMO_PASSWORD || 'Qentro!!1'

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  // Operator login
  if (username === DEMO_USER && password === DEMO_PASS) {
    req.session.authenticated = true
    req.session.role = 'operator'
    req.session.customerId = null
    req.session.customerName = null
    req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Session error' })
      res.json({ success: true, role: 'operator' })
    })
    return
  }

  // Customer login — credentials stored in Customer table
  const customer = await prisma.customer.findUnique({ where: { username } })
  if (customer && customer.password === password) {
    req.session.authenticated = true
    req.session.role = 'customer'
    req.session.customerId = customer.id
    req.session.customerName = customer.name
    req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Session error' })
      res.json({ success: true, role: 'customer', customerName: customer.name })
    })
    return
  }

  res.status(401).json({ error: 'Invalid credentials' })
})

router.post('/logout', (req, res) => {
  req.session.destroy()
  res.json({ success: true })
})

router.get('/me', (req, res) => {
  res.json({
    authenticated: !!req.session?.authenticated,
    role: req.session?.role || null,
    customerId: req.session?.customerId || null,
    customerName: req.session?.customerName || null,
  })
})

export default router
