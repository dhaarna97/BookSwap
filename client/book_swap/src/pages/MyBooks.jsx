import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { booksAPI } from '../services/api'
import './Dashboard.css'

const MyBooks = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchMyBooks()
  }, [])

  const fetchMyBooks = async () => {
    try {
      const response = await booksAPI.getMyBooks()
      setBooks(response.data.data)
    } catch (error) {
      setError('Failed to fetch your books')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      try {
        await booksAPI.deleteBook(bookId)
        setBooks(books.filter(book => book._id !== bookId))
        alert('Book deleted successfully!')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete book')
      }
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
          <h1>My Books</h1>
          <button 
            onClick={() => navigate('/add-book')}
            className="add-book-btn"
          >
            Add New Book
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="books-grid">
          {books.length === 0 ? (
            <div className="no-books">
              <p>You haven't added any books yet.</p>
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
                  </div>
                  
                  {book.totalRequests > 0 && (
                    <p className="request-count">{book.totalRequests} request(s)</p>
                  )}
                  
                  <div className="book-actions">
                    <div className="own-book">
                      <button className="edit-btn">Edit</button>
                      <button 
                        onClick={() => handleDeleteBook(book._id, book.title)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
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

export default MyBooks