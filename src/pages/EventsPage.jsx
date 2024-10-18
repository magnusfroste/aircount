import React from 'react'
import Events from '../components/Events'
import Header from '../components/Header'

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto p-4">
        <Events />
      </div>
    </div>
  )
}

export default EventsPage