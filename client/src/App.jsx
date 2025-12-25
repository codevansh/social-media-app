import './App.css'
import Login from './pages/Login.jsx'
import Feed from './pages/Feed.jsx'
import Messages from './pages/Messages.jsx'
import Chatbox from './pages/Chatbox.jsx'
import Connections from './pages/Connections.jsx'
import Discover from './pages/Discover.jsx'
import Profile from './pages/Profile.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Layout from './pages/Layout.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useUser, useAuth } from '@clerk/clerk-react'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice.js'
import { fetchConnections } from './features/connections/connectionSlice.js'
import { addMessages } from './features/messagse/messageSlice.js'
import Notification from './components/Notification.jsx'

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken()

        await fetch(
          import.meta.env.VITE_BASEURL + '/api/user/data',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
      }
    }
    fetchData()
  }, [user, getToken, dispatch])

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id)

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (pathnameRef.current === ('/messages/' + message.from_user_id._id)) {
          dispatch(addMessages(message))
        } else {
          toast.custom((t) => (
            <Notification t={t} message={message} />
          ), { position: "bottom-right" })
        }
      }
      return () => {
        eventSource.close()
      }
    }
  }, [user, dispatch])

  return (
    <>
      <Toaster />
      {!user ? (
        <Login />) :
        (
          <Routes>
            <Route element={<Layout />} >
              <Route path='/' index element={<Feed />} />
              <Route path='/feed' index element={<Feed />} />
              <Route path='messages' element={<Messages />} />
              <Route path='messages/:userId' element={<Chatbox />} />
              <Route path='connections' element={<Connections />} />
              <Route path='discover' element={<Discover />} />
              <Route path='profile' element={<Profile />} />
              <Route path='profile/:profileId' element={<Profile />} />
              <Route path='/createpost' element={<CreatePost />} />
            </Route>
          </Routes>
        )
      }
    </>
  )
}

export default App
