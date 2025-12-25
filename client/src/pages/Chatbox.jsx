import { useRef, useState, useEffect } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { ImageIcon, SendHorizontal } from "lucide-react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios.js'
import { addMessages, fetchMessages, resetMessages } from "../features/messagse/messageSlice.js";
import toast from 'react-hot-toast'
const Chatbox = () => {

    const { messages } = useSelector((state) => state.messages)
    const { userId } = useParams()
    const { getToken } = useAuth()
    const dispatch = useDispatch()

    const [text, setText] = useState('')
    const [image, setImage] = useState(null)
    const [user, setUser] = useState(null)
    const messagesEndRef = useRef(null)

    const connections = useSelector((state) => state.connection.connections)

    const fetchUserMEssages = async () => {
        try {
            const token = await getToken()
            dispatch(fetchMessages({ token, userId }))
        } catch (error) {
            toast.error(error.msg)
        }
    }

    const sendMessage = async () => {
        try {
            if (!text && !image) return
            const token = await getToken()
            const formData = new FormData()

            formData.append('to_user_id', userId)
            formData.append('text', text)

            if (image) formData.append('image', image)

            const { data } = await api.post('/api/message/send', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                setText("")
                setImage(null)
                dispatch(addMessages(data.message))
            } else {
                throw new Error(data.msg)
            }
        } catch (error) {
            toast.error(error.msg)
        }
    }

    useEffect(() => {
        if (connections.length > 0) {
            const user = connections.find(connection => connection._id === userId)
            setUser(user)
        }
    }, [connections, userId])

    useEffect(() => {
        fetchUserMEssages()
        return () => {
            dispatch(resetMessages())
        }
    }, [userId])


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages])

    return user && (
        <div className="flex flex-col h-screen">
            <div className="flex items-center gap-2 p-2 md:px-10  bg-linear-to-r from-indigo-50 to-purple-50 border-b border-gray-300">

                <img src={user.profile_picture} className="size-8 rounded-full" />

                <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
                </div>

            </div>

            <div className="p-5 md:px-10 h-full overflow-y-scroll">
                <div className="space-y-4 max-w-4xl mx-auto">
                    {
                        messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (

                            <div key={index}
                                className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>

                                <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                                    {
                                        message.message_type === 'image' &&
                                        <img src={message.media_url} className="w-full max-w-sm rounded-lg mb-1" />
                                    }
                                    <p>{message.text}</p>

                                </div>

                            </div>
                        ))
                    }
                    <div>
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <div className="px-4">

                <div className="flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border-border-gray-200 shadow rounded-lg mb-5 border border-gray-700">

                    <input type="text" placeholder="Type your Message" className="flex-1 outline-none text-slate-700" onKeyDown={e => e.key === 'Enter' && sendMessage()} onChange={(e) => setText(e.target.value)} value={text} />

                    <label htmlFor="image">
                        {
                            image
                                ?
                                <img src={URL.createObjectURL(image)} className="h-8 rounded" />
                                :
                                <ImageIcon className="size-7 text-gray-400 cursor-pointer" />
                        }
                        <input type="file" id="image" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
                    </label>

                    <button className="bg-linear-to-r from-indigo-600 to-purple-700 active:scale-95 transtion text-white font-medium px-4 py-2 rounded-md cursor-pointer flex gap-2" onClick={sendMessage}>Send
                        <SendHorizontal className="w-5" />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Chatbox;