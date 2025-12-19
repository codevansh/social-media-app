import fs from 'fs'
import imagekit from '../configs/imagekit.js';
import Story from '../models/story.js';
import User from '../models/user.js'

//add user story
export const addUserStory = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { content, media_type, bg_color } = req.body
        const media = req.file;

        let media_url = ''
        if (media_type === 'image' || media_type === 'video') {
            const fileBuffer = fs.readFileSync(media.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
            })
            media_url = response.url;
        }

        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            bg_color
        })

        res.json({
            success: true,
            story
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

//get user story
export const getUserStory = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)

        //user connections and followings.
        const userIds = [userId, ...user.connections, ...user.following]
        const stories = await Story.find({
            user: { $in: userIds }
        }).populate('user').sort({ createdAt: -1 })

        res.json({
            success: true,
            stories
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}
