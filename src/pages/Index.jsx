import React from 'react'
import Records from '../components/Records'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

const Index = () => {
  const { logout } = useSupabaseAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to log out')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Records />
      </div>
    </div>
  )
}

export default Index