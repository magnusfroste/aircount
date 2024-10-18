import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { session } = useSupabaseAuth()
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
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">Aircount</Link>
        <nav className="hidden md:flex space-x-4">
          {session ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
              <Link to="/templates" className="text-gray-600 hover:text-blue-600 transition-colors">Templates</Link>
              <Link to="/transactions" className="text-gray-600 hover:text-blue-600 transition-colors">Transactions</Link>
              <Link to="/profit-and-loss" className="text-gray-600 hover:text-blue-600 transition-colors">Profit & Loss</Link>
              <Link to="/balance-sheet" className="text-gray-600 hover:text-blue-600 transition-colors">Balance Sheet</Link>
              <Link to="/ledger" className="text-gray-600 hover:text-blue-600 transition-colors">Ledger</Link>
              <Link to="/opening-balances" className="text-gray-600 hover:text-blue-600 transition-colors">Opening Balances</Link>
              <Link to="/accounts" className="text-gray-600 hover:text-blue-600 transition-colors">Accounts</Link>
              <Link to="/import" className="text-gray-600 hover:text-blue-600 transition-colors">Import</Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</Link>
              <Button onClick={handleLogout} variant="ghost" className="text-blue-600 hover:text-blue-700">Logout</Button>
            </>
          ) : (
            <>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header