import React from 'react'
import { assets, dummyUserData } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/clerk-react'

const SideBar = ({ sideBarOpen, setSideBarOpen }) => {

    const navigate = useNavigate();
    const user = dummyUserData;
    const { signOut } = useClerk()

    return (
        <div className={`w-60 xl:w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sideBarOpen ? 'translate-x-0' : 'max-sm:translate-x-full'} transition-all duration-300 ease-in-out`}>

            <div className='w-full'>
                <img src={assets.logo} alt="" className='w-26 ml-7 my-2 cursor-pointer' onClick={() => navigate('/')
                } />
                < hr className='border-gray-300 mb-8' />
                <MenuItems setSideBarOpen={setSideBarOpen} />

                <Link to='/createpost' className='flex justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-linear-to-r from-indigo-700 to-purple-800 active:scale-95 transition text-white cursor-pointer'>
                    <CirclePlus className='w-5 h-5' /> Create Post
                </Link>
            </div>
            <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center'>
                <div className='flex items-center cursor-pointer gap-2 '>
                    <UserButton />
                    <div className='pr-11'>
                        <h1 className='text-sm font-medium'>{user.full_name}</h1>
                        <p className='text-xs text-gray-500'>@{user.username}</p>
                    </div>
                </div>
                <LogOut className='w-5 text-gray-400 hover:text-gray-700 transition cursor-pointer' onClick={signOut}/>
            </div>
        </div>
    )
}

export default SideBar