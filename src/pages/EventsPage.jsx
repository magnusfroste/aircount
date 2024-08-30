import React from 'react'
import Events from '../components/Events'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'

const EventsPage = () => {
  const { logout } = useSupabaseAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Button onClick={logout}>Logout</Button>
        </div>
        <Events />
      </div>
    </div>
  )
}

export default EventsPage
