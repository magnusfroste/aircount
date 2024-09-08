import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const Navigation = () => {
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
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">AirAccounter</Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/transactions" className="hover:text-gray-300">Transactions</Link>
          <Link to="/profit-and-loss" className="hover:text-gray-300">Profit & Loss</Link>
          <Link to="/balance-sheet" className="hover:text-gray-300">Balance Sheet</Link>
          <Link to="/ledger" className="hover:text-gray-300">Ledger</Link>
          <Link to="/opening-balances" className="hover:text-gray-300">Opening Balances</Link>
          <Link to="/accounts" className="hover:text-gray-300">Accounts</Link>
          <Link to="/import" className="hover:text-gray-300">Import</Link>
          <Link to="/templates" className="hover:text-gray-300">Templates</Link>
          <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-gray-300">Logout</Button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation