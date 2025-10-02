import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { booksAPI } from '../services/api'
import './AddBook.css'

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'Good',
    image: null
  })
  const [imageMethod, setImageMethod] = useState('url')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const conditionOptions = ['New', 'Like New', 'Very Good', 'Good', 'Acceptable']

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        image: e.target.files[0]
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const submitData = {
        ...formData,
        image: imageMethod === 'url' ? imageUrl : formData.image
      }

      await booksAPI.addBook(submitData)
      navigate('/my-books')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add book')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/my-books')
  }

  return (
    <PageLayout>
      <div className="add-book-container">
        <div className="add-book-card">
          <h1>Add New Book</h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="add-book-form">
            <div className="form-group">
              <label htmlFor="title">Book Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition *</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                {conditionOptions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Book Image (optional)</label>
              <div className="image-method">
                <button
                  type="button"
                  className={`method-btn ${imageMethod === 'url' ? 'active' : ''}`}
                  onClick={() => setImageMethod('url')}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`method-btn ${imageMethod === 'file' ? 'active' : ''}`}
                  onClick={() => setImageMethod('file')}
                >
                  Upload File
                </button>
              </div>
              
              {imageMethod === 'url' ? (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/book-cover.jpg"
                />
              ) : (
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
              )}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="add-btn"
                disabled={loading}
              >
                {loading ? 'Adding Book...' : 'Add Book'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}

export default AddBook