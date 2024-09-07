import React from 'react'
import Dashboard from '../components/Dashboard'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const Index = () => {
  const { session } = useSupabaseAuth()

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <Dashboard />
    </div>
  )
}

export default Index