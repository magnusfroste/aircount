import React from 'react'
import Dashboard from '../components/Dashboard'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const DashboardPage = () => {
  const { session } = useSupabaseAuth()

  if (!session) {
    return <div className="text-center text-lg text-blue-600">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Dashboard />
    </div>
  )
}

export default DashboardPage