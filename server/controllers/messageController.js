import imagekit from "../configs/imagekit.js";
import Message from "../models/messages.js";

//creating an empty object to store server side event connections
const connections = {};

//controller function for the SSE endpoint
export const sseController = async (req, res) => {
    const { userId } = req.params
    console.log("New Client Connected: ", userId)

    //Set SSE Headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    //add the client's response object to the connections object
    connections[userId] = res;

    //send an inital event to hte client
    res.write('log: Connected to the server side event stream \n')

    //client disconnections
    req.on('close', () => {
        //remove the client res object from the connections array
        delete connections[userId];
        console.log("Client Disconnected")
    })
}

//send message
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = ''
        let message_type = image ? "image" : "text"

        if (message_type === 'image') {
            const fs = await import('fs')
            const fileBuffer = fs.readFileSync(image.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname,
            })

            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url
        })

        res.json({
            success: true,
            message
        })

        const message_with_user_data = await Message.findById(message._id).populate('from_user_id')

        if (connections[to_user_id]) {
            connections[to_user_id].write(`data:${JSON.stringify(message_with_user_data)}\n\n`)
        }

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

//get chat messages
export const getChatMessage = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { to_user_id } = req.body;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId }
            ]
        }).sort({ createdAt: -1 })

        await Message.updateMany({
            from_user_id: to_user_id,
            to_user_id: userId
        }, {
            seen: true
        })

        res.json({
            success: true,
            messages
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}

//get recent chat messages
export const getRecentChatMessage = async (req, res) => {
    try {
        const { userId } = req.auth()

        const messages = await Message.find({
            to_user_id: userId
        }).populate('from_user_id to_user_id').sort({ createdAt: -1 })

        res.json({
            success: true,
            messages
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: error.msg
        })
    }
}