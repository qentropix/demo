import { Router } from 'express'

const router = Router()

const DEMO_USER = process.env.DEMO_USERNAME || 'demo'
const DEMO_PASS = process.env.DEMO_PASSWORD || 'Qentro!!1'

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username === DEMO_USER && password === DEMO_PASS) {
    req.session.authenticated = true
    return res.json({ success: true })
  }
  res.status(401).json({ error: 'Invalid credentials' })
})

router.post('/logout', (req, res) => {
  req.session.destroy()
  res.json({ success: true })
})

router.get('/me', (req, res) => {
  res.json({ authenticated: !!req.session?.authenticated })
})

export default router
