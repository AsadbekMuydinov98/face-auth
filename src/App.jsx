import { Route, Routes } from 'react-router-dom'
import './App.css'
import FullScreenWebcam from './components/FullScreen'
import Login from './components/Login'
import MyNavbar from './components/MyNavbar'
import Snapshot from './components/Snapshot'
import Home from './components/Home'

function App() {

  return (
    <>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/webcam" element={<FullScreenWebcam />} /> 
        <Route path="/signup" element={<Snapshot />} />
      </Routes>
    </>
  )
}

export default App
