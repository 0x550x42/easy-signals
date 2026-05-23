import express from 'express'
import { getAllSignals } from '../controllers/allSignalsController.js'

const router = express.Router()

// GET /api/signals/all
router.get('/all', getAllSignals)

export default router
