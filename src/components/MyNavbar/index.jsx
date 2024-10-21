import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const MyNavbar = () => {
  return (
    <nav>
        <div><Link  to="/">Home</Link></div>
        <div><Link  to="/signup">Sign up</Link></div>
        <div><Link  to="/login">Login</Link></div>
        <div><Link  to="/webcam">Analyze students</Link></div>
    </nav>
  )
}

export default MyNavbar