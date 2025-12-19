import { success } from 'zod';
import imagekit from '../configs/imagekit.js';
import Connection from '../models/connections.js';
import User from '../models/user.js'
import fs from 'fs'
import Post from '../models/post.js';

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)
        if (!user) {
            return res.json({
                success: false,
                msg: "User not found"
            })
        }
        res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth()
        let { username, bio, location, full_name } = req.body;

        const tempUser = await User.findById(userId)

        !username && (username = tempUser.username)

        if (tempUser.username !== username) {
            const user = await User.findOne({ username })
            if (user) {
                username = tempUser.username
            }
        }

        const updateData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        //uploading profile picture into imagekit
        if (profile) {
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '512' }
                ]
            })

            updateData.profile_picture = url
        }

        //uploading cover picture into imagekit
        if (cover) {
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })

            updateData.cover_photo = url
        }

        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true
        })

        res.json({
            success: true,
            user,
            msg: "Profile Updated Successfully"
        })

    } catch (error) {
        console.log(error);
        resizeBy.json({
            success: false,
            msg: error.msg
        })
    }
}

export const discoverUsers = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { input } = req.body;

        const allUsers = await User.find({
            $or: [
                { username: new RegExp(input, 'i') },
                { email: new RegExp(input, 'i') },
                { full_name: new RegExp(input, 'i') },
                { location: new RegExp(input, 'i') },
            ]
        })

        const filteredUsers = allUsers.filter(user => user._id !== userId)
        res.json({
            success: true,
            users: filteredUsers
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth()  // loggedin users id
        const { id } = req.body;  // id of the other users

        const user = await User.findById(userId)

        if (user.following.includes(id)) {
            return res.json({
                success: false,
                msg: "You are already following this user"
            })
        }
        user.following.push(id);
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save()

        res.json({
            success: true,
            msg: "Now you are following this user"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth()  // loggedin users id
        const { id } = req.body;  // id of the other users

        const user = await User.findById(userId)
        user.following = user.following.filter(user => user !== id)
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers = toUser.followers.filter(user => user !== userId)
        await toUser.save()

        res.json({
            success: true,
            msg: "You are no longer following this user"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

// ------------ // ------------ //
export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;

        const last24hrs = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const connectionRequests = await Connection.find({
            from_user_id: userId,
            createdAt: {
                $gt: last24hrs
            }
        })
        if (connectionRequests.length >= 20) {
            return res.json({
                success: false,
                msg: "You have sent more than 20 connection requests in last 24 hrs"
            })
        }

        //if users are already connected
        const connection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId }
            ]
        })

        if (!connection) {
            await Connection.create({
                from_user_id: userId,
                to_user_id: id
            })
            
            return res.json({
                success: true,
                msg: "Connection Request sent successfully"
            })
        } else if (connection && connection.status === 'Accepted') {
            return res.json({
                success: false,
                msg: "You are already connected to this uer"
            })
        }
        return res.json({
            success: false,
            msg: "Connection Request pending"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

export const getUserConnections = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)
            .populate('connections followers following')

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnections = (await Connection.find({
            to_user_id: userId,
            status: 'Pending'
        })
            .populate('from_user_id')).map(connection => connection.from_user_id)

        res.json({
            success: true,
            connections,
            followers,
            following,
            pendingConnections
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

export const acceptConnections = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;

        const connection = await Connection.findOne({
            from_user_id: id,
            to_user_id: userId
        })

        if (!connection) {
            return res.json({
                success: false,
                msg: "Connection not found"
            })
        }

        const user = await User.findById(userId)
        user.connections.push(id)
        await user.save()

        const toUser = await User.findById(id)
        toUser.connections.push(userId)
        await toUser.save()

        connection.status = 'Accepted'
        await connection.save()

        res.json({
            succes: true,
            msg: "Connection Accepted"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

// ------------ // ------------ //
export const getUserProfile = async (req, res) => {
    try {
        const { profileId } = req.body;
        const profile = await User.findById(profileId)

        if (!profile) {
            res.json({
                success: false,
                msg: "User Profile not found"
            })
        }

        const posts = Post.find({
            user: profileId
        }).populate('user')
        
        res.json({
            success: true,
            profile,
            posts
        })


    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Failed to get user profiles" || error.msg
        })
    }
}