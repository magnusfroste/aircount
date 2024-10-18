import React from 'react'
import Dashboard from '../components/Dashboard'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const DashboardPage = () => {
  const { session } = useSupabaseAuth()

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <Dashboard />
      </div>
    </div>
  )
}

export default DashboardPage