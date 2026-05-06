import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import taskRoutes  from './routes/tasks.route.js'
import quoteRoutes from './routes/qoutes.route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const localhostOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]

const allowedOrigins = [...new Set([...envOrigins, ...localhostOrigins])]

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server calls (no Origin header), Postman, and same-origin.
    if (!origin) return callback(null, true)

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks',  taskRoutes)
app.use('/api/quotes', quoteRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS origin denied' })
  }

  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app