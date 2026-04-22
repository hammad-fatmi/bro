import express from 'express'
// import { register, reVerify, verify, login, logout, forgotPassword, verifyOTP, changePassword, allUser, getUserById, updateUser } from '../controller/userController.js'
import * as userController from '../controller/userController.js';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js'
import { singleUpload } from "../middleware/multer.js";


const router = express.Router()


router.post('/register', userController.register)
router.post('/verify', userController.verify)
router.post('/reverify', userController.reVerify)
router.post('/login', userController.login)

// router.post('/logout', isAuthenticated, userController.logout)
router.post('/logout', userController.logout)
router.post('/forgot-password', userController.forgotPassword)

router.post('/verify-otp/:email', userController.verifyOTP)
router.post('/change-password/:email', userController.changePassword)

router.get('/all-user', isAuthenticated, isAdmin, userController.allUser)
router.get('/get-user/:userId', userController.getUserById)

router.put("/update/:id", isAuthenticated, singleUpload, userController.updateUser)

export default router




