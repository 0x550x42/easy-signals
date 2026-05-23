import express from 'express'
import { estimateTripCost } from '../controllers/travelController.js'

const router = express.Router()

// POST /api/travel/estimate
router.post('/estimate', estimateTripCost)

export default router
