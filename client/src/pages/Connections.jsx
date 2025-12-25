import { Users, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchConnections } from '../features/connections/connectionSlice';
import api from '../api/axios.js'
import { toast } from 'react-hot-toast'

const Connections = () => {
    const { connections, pendingConnections, followers, following } = useSelector((state) => state.connection)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { getToken } = useAuth()

    const [currentTab, setCurrentTab] = useState('Followers')
    const dataArray = [
        { label: 'Followers', value: followers, icon: Users },
        { label: 'Following', value: following, icon: UserCheck },
        { label: 'FollowRequests', value: pendingConnections, icon: UserRoundPen },
        { label: 'Connections', value: connections, icon: UserPlus },
    ]

    const handleUnfollow = async (userId) => {
        try {
            const { data } = await api.post(`/api/user/unfollow`, { userId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            if (data.success) {
                toast.success(data.msg)
                dispatch(fetchConnections(await getToken()))
            } else {
                toast(data.msg)
            }
        } catch (error) {
            toast.error(error.msg)
        }
    }

    const acceptConnection = async (userId) => {
        try {
            const { data } = await api.post(`/api/user/accept`, { userId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            if (data.success) {
                toast.success(data.msg)
                dispatch(fetchConnections(await getToken()))
            } else {
                toast(data.msg)
            }
        } catch (error) {
            toast.error(error.msg)
        }
    }

    useEffect(() => {
        getToken().then((token) => {
            dispatch(fetchConnections(token))
        })
    })

    return (
        <div className='min-h-screen bg-slate-50'>
            <div className='max-w-6xl mx-auto p-6'>
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Connections</h1>
                    <p className="text-slate-600">Manage Your Connections and Discover New Connections</p>
                </div>

                {/* Connection Categories */}
                <div className='mb-8 flex flex-wrap gap-6'>
                    {/* for .map method to return something use parenthesis '()' instead of curly bracis '{}' or use return if using '{}' */}
                    {dataArray.map((item, index) => {
                        return (<div className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md' key={index}>
                            <b>{item.value.length}</b>
                            <p className='text-slate-600'>{item.label}</p>
                        </div>)
                    })}
                </div>

                {/* tags buttons */}
                <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm '>
                    {dataArray.map((tab) => (
                        <button key={tab.label} className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${currentTab === tab.label ? 'bg-white text-black font-medium' : 'text-gray-500 hover:text-black'}`} onClick={() => setCurrentTab(tab.label)}>

                            <tab.icon className="h-4 w-4" />

                            <span className='ml-1'>{tab.label}</span>
                            {tab.count != undefined && (
                                <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>{tab.count}</span>
                            )}

                        </button>
                    ))}
                </div>

                {/* connections */}
                <div className='flex flex-wrap gap-6 mt-6'>
                    {dataArray.find((item) => item.label === currentTab).value.map((user) => (
                        <div className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md' key={user._id}>
                            <img src={user.profile_picture} className='rounded-full w-12 h-12 shadow-md mx-auto' />
                            <div className='flex-1'>
                                <p className='font-medium text-slate-700'>{user.full_name}</p>
                                <p className=' text-slate-500'>{user.username}</p>
                                {/* added by me */}
                                {currentTab === 'FollowRequests' && (
                                    <p className='text-sm text-gray-600'>{user.bio.slice(0, 30)}...</p>
                                )}
                                <div className='flex flex-col sm:flex-row gap-2 mt-4 '>
                                    {
                                        <button onClick={() => navigate(`/profile/${user._id}`)} className='w-full p-2 text-sm rounded bg-linear-to-r from-indigo-500 to-purple-600 active:scale-95 transition text-white cursor-pointer'>
                                            View Profile
                                        </button>
                                    }
                                    {
                                        currentTab === 'Following' && (
                                            <button onClick={() => handleUnfollow(user._id)} className='w-full p-2 text-sm rounded bg0slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                                                Unfollow
                                            </button>
                                        )
                                    }
                                    {
                                        currentTab === 'FollowRequests' && (
                                            <button onClick={() => acceptConnection(user._id)}
                                                className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                                                Accept
                                            </button>
                                        )
                                    }
                                    {
                                        currentTab === 'Connections' && (
                                            <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1' onClick={() => navigate(`/message/${user._id}`)}>
                                                <MessageSquare className='w-4 h-4' />
                                                Message
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Connections;