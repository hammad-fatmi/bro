import express from 'express'
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js'
import { multipleUpload } from '../middleware/multer.js'

const router = express.Router()

router.post('/add', isAuthenticated, isAdmin, multipleUpload)
router.put("/update/:productId", isAuthenticated, isAdmin)

export default router            