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
import { Routes, Route } from 'react-router-dom'
import { useUser, useAuth } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { user } = useUser();

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
