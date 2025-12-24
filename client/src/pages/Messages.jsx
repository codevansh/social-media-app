import { Eye, MessageSquare } from "lucide-react";
import { dummyConnectionsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connections/connectionSlice";

const Messages = () => {

    const { connections } = useSelector((state) => state.connection)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { getToken } = useAuth()

    useEffect(() => {
        getToken().then((token) => {
            dispatch(fetchConnections(token))
        })
    }, [dispatch, getToken])

    return (
        <div className="min-h-screen relative bg-slate-50">

            <div className="max-w-6xl mx-auto p-6">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
                    <p className="text-slate-600">Talk to your Friends & Family</p>
                </div>

                {/* Connected Users */}
                <div className="flex flex-col gap-3">
                    {connections.map((user) => (
                        <div key={user._id} className="max-w-xl flex flex-warp gap-5 p-6 bg-white shadow rounded-md">

                            {/* User Profile PIcture */}
                            <img src={user.profile_picture} alt="" className="rounded-full size-12 mx-auto" />

                            {/* User details */}
                            <div className="flex-1">
                                <p className="font-medium text-slate-700">{user.full_name}</p>
                                <p className="text-slate-500">@{user.username}</p>
                                {/* <p className="text-sm text-gray-600">{user.bio}</p> */}
                            </div>

                            <div className="flex flex-col gap-4">

                                <button className="size-10 flex items-center justify-center text-sm rounded bg-slate-300 cursor-pointer gap-1 hover:bg-slate-200 text-slate-800 active:scale-95 transition" onClick={() => navigate(`/messages/${user._id}`)}>
                                    <MessageSquare className="w-4 h-4" />
                                </button>

                                {/* <button className="size-10 flex items-center justify-center text-sm rounded bg-slate-300 cursor-pointer  hover:bg-slate-200 text-slate-800 active:scale-95 transition ">
                                    <Eye className="w-4 h-4" />
                                </button> */}
                                {/* you can add naviagate(`/profile/user._idin the above commented button for viewing the user profile) */}

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Messages;