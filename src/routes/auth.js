import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

const DEMO_USER = process.env.DEMO_USERNAME || 'demo'
const DEMO_PASS = process.env.DEMO_PASSWORD || 'Qentro!!1'

// Parse CUSTOMER_LOGINS="midwest:midwest123,telecom:telecom123"
function parseCustomerLogins() {
  const raw = process.env.CUSTOMER_LOGINS || ''
  const map = {}
  raw.split(',').forEach(entry => {
    const [username, password] = entry.trim().split(':')
    if (username && password) map[username] = password
  })
  return map
}

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

  // Customer login
  const customerLogins = parseCustomerLogins()
  if (customerLogins[username] && customerLogins[username] === password) {
    // Find customer by matching username to customer name (case-insensitive partial)
    const customers = await prisma.customer.findMany()
    const match = customers.find(c =>
      c.name.toLowerCase().includes(username.toLowerCase()) ||
      username.toLowerCase().includes(c.name.toLowerCase().split(' ')[0].toLowerCase())
    )
    if (!match) return res.status(401).json({ error: 'Customer account not configured' })

    req.session.authenticated = true
    req.session.role = 'customer'
    req.session.customerId = match.id
    req.session.customerName = match.name
    req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Session error' })
      res.json({ success: true, role: 'customer', customerName: match.name })
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
