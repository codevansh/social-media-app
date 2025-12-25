import express from 'express'
import { acceptConnections, discoverUsers, followUser, getUserConnections, getUserData, getUserProfile, sendConnectionRequest, unfollowUser, updateUserData } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import upload from '../configs/multer.js'
import { getRecentChatMessage } from '../controllers/messageController.js'

const userRouter = express.Router()

// ------------ // ------------ //
userRouter.get('/data', protect, getUserData)
userRouter.post('/update', upload.fields(
    [
        { name: 'profile', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]
), protect, updateUserData)
userRouter.get('/discover', protect, discoverUsers)
userRouter.post('/:id/follow', protect, followUser)
userRouter.post('/:id/unfollow', protect, unfollowUser)

// ------------ // ------------ //
userRouter.post('/connect', protect, sendConnectionRequest)
userRouter.post('/acceptconnections', protect, acceptConnections)
userRouter.get('/connections', protect, getUserConnections)

// ------------ // ------------ //
userRouter.get('/profile/:profileId', protect, getUserProfile)
userRouter.post('/recent-messages', protect, getRecentChatMessage)

export default userRouter