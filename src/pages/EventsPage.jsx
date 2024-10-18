import React from 'react'
import Events from '../components/Events'

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Events</h1>
        <Events />
      </div>
    </div>
  )
}

export default EventsPage