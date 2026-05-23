import express from 'express'
import { getMetalSignals } from '../controllers/signalsController.js'

const router = express.Router()

// GET /api/signals/metals
router.get('/metals', getMetalSignals)

export default router
