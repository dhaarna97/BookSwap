import React, { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { booksAPI } from '../services/api'
import './Requests.css'

const ReceivedRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReceivedRequests()
  }, [])

  const fetchReceivedRequests = async () => {
    try {
      const response = await booksAPI.getReceivedRequests()
      setRequests(response.data.data)
    } catch (error) {
      setError('Failed to fetch received requests')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAction = async (requestId, action, bookTitle) => {
    const actionText = action === 'accept' ? 'accept' : 'decline'
    if (window.confirm(`Are you sure you want to ${actionText} this request for "${bookTitle}"?`)) {
      try {
        await booksAPI.handleRequest(requestId, action)
        // Update the request status in the state
        setRequests(requests.map(request => 
          request.requestId === requestId 
            ? { ...request, status: action === 'accept' ? 'Accepted' : 'Declined' }
            : request
        ))
        alert(`Request ${actionText}ed successfully!`)
      } catch (error) {
        alert(error.response?.data?.message || `Failed to ${actionText} request`)
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
          <h1>Received Requests</h1>
          <p>Manage requests for your books</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="requests-list">
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>You haven't received any book requests yet.</p>
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
                  
                  <div className="requester-info">
                    <p><strong>Requested by:</strong> {request.requester.name} ({request.requester.email})</p>
                  </div>
                  
                  <div className="request-meta">
                    <span className={`condition ${request.book.condition.toLowerCase().replace(' ', '-')}`}>
                      {request.book.condition}
                    </span>
                    <span className={`status ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <p className="request-date">
                    {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="request-actions">
                  {request.status === 'Pending' && (
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleRequestAction(request.requestId, 'accept', request.book.title)}
                        className="accept-btn"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRequestAction(request.requestId, 'decline', request.book.title)}
                        className="decline-btn"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  {request.status === 'Accepted' && (
                    <div className="success-message">
                      <p>✅ Request accepted</p>
                    </div>
                  )}
                  {request.status === 'Declined' && (
                    <div className="declined-message">
                      <p>❌ Request declined</p>
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

export default ReceivedRequests