import express from 'express'
import session from 'express-session'
import pgSession from 'connect-pg-simple'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const PgSession = pgSession(session)

import authRoutes from './routes/auth.js'
import buildRoutes from './routes/builds.js'
import testResultRoutes from './routes/testResults.js'
import reportRoutes from './routes/report.js'
import customerRoutes from './routes/customers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
app.set('trust proxy', 1)

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())

app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'qentropix-demo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/builds', buildRoutes)
app.use('/api/test-results', testResultRoutes)
app.use('/api/report', reportRoutes)
app.use('/api/customers', customerRoutes)

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
