import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const StoryModel = ({ setShowModel, fetchStories }) => {

    const bgColors = ["red", "blue", "green", "yellow", "pink"]
    const [mode, setMode] = useState("text")
    const [bg, setBg] = useState(bgColors[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const [prevUrl, setPrevUrl] = useState(null)

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setMedia(file);
            setPrevUrl(URL.createObjectURL(file))
        }
    }

    const handleCreateStory = async () => {

    }

    return (
        <div className='fixed inset-0 z-110 min-h-screen backdrop-blur text-black bg-black/80 flex items-center justify-center p-4'>

            <div className='w-full max-w-md'>
                <div className='text-center mb-4 flex items-center justify-between'>
                    <button onClick={() => setShowModel(false)} className='text-white p-2 cursor-pointer'>
                        <ArrowLeft />
                    </button>
                    <h2 className=' text-white text-lg font-semibold'>Create Story</h2>
                    <span className='w-10'></span>
                </div>
                <div className='rounded-lg h-96 flex items-center justify-center relative' style={{ background: bg }}>

                    {mode === 'text' && (
                        <textarea name="" id="" placeholder='Whats on your Mind' className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none' onChange={(e) => {
                            setText(e.target.value)
                        }} value={text}></textarea>
                    )}

                    {mode === 'media' && prevUrl && (
                        media?.type.startsWith('image') ? (
                            <img src={prevUrl} alt="" className='object-contain max-h-full' />
                        ) : (
                            <video src={prevUrl} className='object-contain max-h-full' />
                        )
                    )}

                </div>
                <div className='flex mt-4 gap-2'>
                    {bgColors.map((color) => (
                        <button key={color} className='w-6 h-6 rounded-full cursor-pointer ring' style={{ background: color }} onClick={() => setBg(color)} />
                    ))}
                </div>
                <div className='flex gap-2 mt-4'>

                    <button onClick={() => { setMode('text'); setMedia(null); setPrevUrl(null) }} className={` cursor-pointer flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white ${mode === 'text' ? " text-black border-2" : " border-2"}`}>
                        <TextIcon size={18} /> Text
                    </button>

                    <label className={`flex flex-1 items-center justify-center gap-2 p-2 cursor-pointer rounded-lg bg-white ${mode === 'media' ? " text-black" : " border-2"}`}>
                        <input type="file" accept='image/*, video/*' className='hidden' onChange={(e) => { handleMediaUpload(e); setMode("media") }} />
                        <Upload size={18} /> Photo/Video
                    </label>

                </div>
                <button onClick={(e) => toast.promise(handleCreateStory(), {
                    loading: 'Saving...',
                    success: <p>Story Added</p>,
                    error: <p>{e.message}</p>
                })} className='flex items-center justify-center gap-2 text-white py-3 mt4 w-full bg-purple-600 cursor-pointer mt-4  rounded-lg'>
                    <Sparkle size={18} /> Create Story
                </button>
            </div>

        </div>
    )
}

export default StoryModel