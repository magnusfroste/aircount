import React from 'react'
import Transactions from '../components/Transactions'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

const TransactionsPage = () => {
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Transactions />
        </div>
      </div>
    </div>
  )
}

export default TransactionsPage