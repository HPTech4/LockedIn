import { Router } from 'express'
import { getQuotes, createQuote, deleteQuote } from '../controllers/qoutes.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.use(protect) // all quote routes are protected

router.get('/',       getQuotes)
router.post('/',      createQuote)
router.delete('/:id', deleteQuote)

export default router