import React, { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { booksAPI } from '../services/api'
import './Requests.css'

const MyRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    try {
      const response = await booksAPI.getMyRequests()
      setRequests(response.data.data)
    } catch (error) {
      setError('Failed to fetch your requests')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRequest = async (requestId, bookTitle) => {
    if (window.confirm(`Are you sure you want to cancel your request for "${bookTitle}"?`)) {
      try {
        await booksAPI.cancelRequest(requestId)
        setRequests(requests.filter(request => request.requestId !== requestId))
        alert('Request cancelled successfully!')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel request')
      }
    }
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending'
      case 'accepted': return 'status-accepted'
      case 'declined': return 'status-declined'
      default: return 'status-pending'
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
      <div className="requests-container">
        <div className="requests-header">
          <h1>My Requests</h1>
          <p>Track your book requests</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="requests-list">
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>You haven't made any book requests yet.</p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.requestId} className="request-card">
                {request.book.image && (
                  <div className="request-image">
                    <img src={request.book.image} alt={request.book.title} />
                  </div>
                )}
                
                <div className="request-info">
                  <h3 className="request-title">{request.book.title}</h3>
                  <p className="request-author">by {request.book.author}</p>
                  <div className="request-meta">
                    <span className={`condition ${request.book.condition.toLowerCase().replace(' ', '-')}`}>
                      {request.book.condition}
                    </span>
                    <span className={`status ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="request-date">
                    Requested on {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="request-actions">
                  {request.status === 'Pending' && (
                    <button 
                      onClick={() => handleCancelRequest(request.requestId, request.book.title)}
                      className="cancel-request-btn"
                    >
                      Cancel Request
                    </button>
                  )}
                  {request.status === 'Accepted' && (
                    <div className="success-message">
                      <p>✅ Your request has been accepted!</p>
                    </div>
                  )}
                  {request.status === 'Declined' && (
                    <div className="declined-message">
                      <p>❌ Your request was declined</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default MyRequests