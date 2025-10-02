import React, { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { booksAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const Dashboard = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getAllBooks()
      setBooks(response.data.data)
    } catch (error) {
      setError('Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestBook = async (bookId) => {
    try {
      await booksAPI.requestBook(bookId)
      // Refresh books to update request status
      fetchBooks()
      alert('Book request sent successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to request book')
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="loading-container">Loading...</div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>All Books</h1>
          <p>Discover books available for exchange</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="books-grid">
          {books.length === 0 ? (
            <div className="no-books">
              <p>No books available at the moment.</p>
            </div>
          ) : (
            books.map((book) => (
              <div key={book._id} className="book-card">
                {book.image && (
                  <div className="book-image">
                    <img src={book.image} alt={book.title} />
                  </div>
                )}
                
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-meta">
                    <span className={`condition ${book.condition.toLowerCase().replace(' ', '-')}`}>
                      {book.condition}
                    </span>
                    <span className="owner">Owner: {book.owner?.name}</span>
                  </div>
                  
                  {book.totalRequests > 0 && (
                    <p className="request-count">{book.totalRequests} request(s)</p>
                  )}
                  
                  <div className="book-actions">
                    {book.owner?._id === user?._id ? (
                      <div className="own-book">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleRequestBook(book._id)}
                        className="request-btn"
                      >
                        Request Book
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default Dashboard