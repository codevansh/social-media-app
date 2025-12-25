import imagekit from "../configs/imagekit.js"
import Post from "../models/post.js";
import User from "../models/user.js";

//add post
export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { content, post_type } = req.body;
        const images = req.files || [];

        let image_urls = []

        if (images.length > 0) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = image.buffer
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts"
                    })

                    return response.url

                })
            )
        }
        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })

        res.status(201).json({
            success: true,
            message: "Post created successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            msg: error.message || "Error creating post"
        })
    }
}

//get post
export const getPost = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const userIds = [userId, ...(user.connections ?? []), ...(user.following ?? [])].filter(id => id)
        const post = await Post.find({
            user: { $in: userIds }
        }).populate('user').sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            post
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error getting posts" || error.message
        })
    }
}

//like posts
export const likePosts = async (req, res) => {
    try {
        const { userId } = req.auth()
        const postId = req.params.id;

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        post.likes_count = post.likes_count || [];

        if (post.likes_count.includes(userId)) {

            post.likes_count = post.likes_count.filter(id => id.toString() !== userId)

            await post.save()

            return res.status(200).json({
                success: true,
                message: "Post Unliked"
            })
        } else {
            post.likes_count.push(userId)

            await post.save()

            return res.status(200).json({
                success: true,
                msg: "Post Liked"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error liking post" || error.message
        })
    }
}