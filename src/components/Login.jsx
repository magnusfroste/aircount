import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Login = () => {
  const { session } = useSupabaseAuth()

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="default"
          providers={[]}
        />
      </div>
    </div>
  )
}

export default Login