import React from 'react'
import Events from '../components/Events'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const EventsPage = () => {
  const { logout } = useSupabaseAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Events</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Events />
      </div>
    </div>
  )
}

export default EventsPage
