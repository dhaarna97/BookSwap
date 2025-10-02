import React from 'react'
import Header from './Header'
import './PageLayout.css'

const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <Header />
      <main className="page-main">
        {children}
      </main>
    </div>
  )
}

export default PageLayout