import React from 'react'
import { SupabaseAuthUI } from '../integrations/supabase'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Navigate } from 'react-router-dom'

const Login = () => {
  const { session } = useSupabaseAuth()

  if (session) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <SupabaseAuthUI />
      </div>
    </div>
  )
}

export default Login