import { useState, useEffect } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../features/user/userSlice'
import { useAuth } from '@clerk/clerk-react'
import {toast} from 'react-hot-toast'

const EditProfile = ({ setShowEdit }) => {

    const dispatch = useDispatch()
    const { getToken } = useAuth()

    const user = useSelector((state) => state.user.value)
    const [editForm, setEditForm] = useState({
        full_name: user?.full_name,
        username: user?.username,
        bio: user?.bio,
        location: user?.location,
        profile_picture: null,
        cover_photo: null,
    })

    const saveProfile = async (e) => {
        e.preventDefault();
        try {

            const userData = new FormData();
            const { full_name, username, bio, location, profile_picture, cover_photo } = editForm

            userData.append('username', username)
            userData.append('full_name', full_name)
            userData.append('bio', bio)
            userData.append('location', location)
            profile_picture && userData.append('profile', profile_picture)
            cover_photo && userData.append('cover', cover_photo)

            const token = await getToken()
            dispatch(updateUser({ userData, token }))

            setShowEdit(false)
        } catch (error) {
            toast.error(error.msg)
        }
    }

    return (
        <div className='fixed inset-0 z-50 bg-black/50 overflow-y-auto'>
            <div className='max-w-2xl sm:py-6 mx-auto'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-4'>Edit Profile</h1>
                    <form onSubmit={(e) => toast.promise(saveProfile(e), { loading: 'Saving...' })} className='space-y-4'>
                        {/* Profile Picture */}
                        <div className='flex flex-col items-start gap-3'>
                            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='profile_picture'>
                                Profile Picture
                                <input hidden type="file" accept='image/*' id='profile_picture' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setEditForm({
                                    ...editForm,
                                    profile_picture: e.target.files[0]
                                })} />
                                <div className='group/profile relative w-20 h-20 mt-2'>
                                    {(editForm.profile_picture || (user?.profile_picture && user.profile_picture !== "")) && (
                                        <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user?.profile_picture} className='w-full h-full rounded-full object-cover ' />
                                    )}
                                    <div className='absolute inset-0 hidden group-hover/profile:flex rounded-full items-center justify-center hover:bg-black/30'>
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>
                        
                        {/* Cover Photo */}
                        <div className='flex flex-col items-start gap-3'>

                            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='cover_photo'>
                                Cover Photo

                                <input hidden type="file" accept='image/*' id='cover_photo' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setEditForm({
                                    ...editForm,
                                    cover_photo: e.target.files[0]
                                })} />

                                <div className='group/cover relative'>
                                    {(editForm.cover_photo || (user?.cover_photo && user.cover_photo !== "")) && (
                                        <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user?.cover_photo} className='w-80 h-40 rounded-lg bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2' />
                                    )}

                                    <div className='absolute inset-0 hidden group-hover/cover:flex rounded-lg items-center justify-center hover:bg-black/30'>
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* fullname */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='full_name'>Full Name</label>

                            <input id='full_name' type="text" placeholder='Write Your Full Name' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setEditForm({
                                ...editForm,
                                full_name: e.target.value
                            })} value={editForm.full_name} />
                        </div>

                        {/* username */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='username'>User Name</label>

                            <input id='username' type="text" placeholder='Have a Unique Username' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setEditForm({
                                ...editForm,
                                username: e.target.value
                            })} value={editForm.username} />
                        </div>

                        {/* bio */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='bio'>Bio</label>

                            <textarea rows={5} placeholder='Tell us Something about Yourself' id='bio' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setEditForm({
                                ...editForm,
                                bio: e.target.value
                            })} value={editForm.bio} />
                        </div>

                        {/* location */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='location'>Location</label>

                            <input id='location' type="text" placeholder='Whats your new Location' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setEditForm({
                                ...editForm,
                                location: e.target.value
                            })} value={editForm.location} />
                        </div>

                        {/* button */}
                        <div className='flex justify-end space-x-3 pt-6'>

                            <button type='button' className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer' onClick={() => setShowEdit(false)}>Cancel</button>

                            <button type='submit' className='px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-700 text-white rounded-lg cursor-pointer'>Save Profile</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProfile