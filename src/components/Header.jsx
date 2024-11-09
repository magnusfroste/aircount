import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  PieChart, 
  ScrollText, 
  Scale, 
  FileUp,
  FileDown,
  UserCircle, 
  LogOut,
  LayoutTemplate,
  Table
} from 'lucide-react'

const Header = () => {
  const { session, logout } = useSupabaseAuth()
  const navigate = useNavigate()

  const { data: companyData } = useQuery({
    queryKey: ['company', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      const { data, error } = await supabase
        .from('companies')
        .select('company_name')
        .eq('user_id', session.user.id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id
  })

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

  if (session) {
    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-8">
            <Link to="/">{companyData?.company_name || 'Loading...'}</Link>
          </h1>
          <nav className="flex flex-col space-y-4">
            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/templates" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <LayoutTemplate className="w-5 h-5 mr-3" />
              Templates
            </Link>
            <Link to="/transactions" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Receipt className="w-5 h-5 mr-3" />
              Transactions
            </Link>
            <Link to="/profit-and-loss" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <PieChart className="w-5 h-5 mr-3" />
              Profit & Loss
            </Link>
            <Link to="/balance-sheet" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Scale className="w-5 h-5 mr-3" />
              Balance Sheet
            </Link>
            <Link to="/ledger" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ScrollText className="w-5 h-5 mr-3" />
              Ledger
            </Link>
            <Link to="/opening-balances" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Opening Balances
            </Link>
            <Link to="/accounts" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Accounts
            </Link>
            <Link to="/import" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <FileUp className="w-5 h-5 mr-3" />
              Import
            </Link>
            <Link to="/import-csv" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Table className="w-5 h-5 mr-3" />
              Import CSV
            </Link>
            <Link to="/export" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <FileDown className="w-5 h-5 mr-3" />
              Export
            </Link>
            <Link to="/profile" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <UserCircle className="w-5 h-5 mr-3" />
              Profile
            </Link>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              className="flex items-center text-gray-600 hover:text-blue-600 w-full justify-start px-0"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </nav>
        </div>
      </aside>
    )
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          <Link to="/">Aircount</Link>
        </h1>
        <nav className="hidden md:flex items-center space-x-4">
          <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
          <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
          <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors">Login</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header