import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/dashboard" className="logo-link">
            📚 BookSwap
          </Link>
        </div>
        
        <nav className="nav">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            All Books
          </Link>
          <Link to="/my-books" className={`nav-link ${isActive('/my-books')}`}>
            My Books
          </Link>
          <Link to="/add-book" className={`nav-link ${isActive('/add-book')}`}>
            Add Book
          </Link>
          <Link to="/my-requests" className={`nav-link ${isActive('/my-requests')}`}>
            My Requests
          </Link>
          <Link to="/received-requests" className={`nav-link ${isActive('/received-requests')}`}>
            Received Requests
          </Link>
        </nav>

        <div className="user-section">
          <span className="user-name">{user?.name || 'User'}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
