import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import metalSignalsRouter from './routes/metalSignals.js'
import allSignalsRouter from './routes/allSignals.js'
import travelRouter from './routes/travel.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/signals', allSignalsRouter)
app.use('/api/signals/metals', metalSignalsRouter)
app.use('/api/travel', travelRouter)

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({ error: 'Internal Server Error' })
})

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' })
})

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`)
})
