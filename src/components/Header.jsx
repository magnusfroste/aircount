import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from "@/components/ui/button"
import { useFiscalYear } from '../contexts/FiscalYearContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Header = () => {
  const { session, signOut } = useSupabaseAuth()
  const navigate = useNavigate()
  const { fiscalYears, selectedYear, setSelectedYear } = useFiscalYear()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link></li>
            <li><Link to="/transactions" className="text-blue-600 hover:text-blue-800">Transactions</Link></li>
            <li><Link to="/accounts" className="text-blue-600 hover:text-blue-800">Accounts</Link></li>
            <li><Link to="/balance-sheet" className="text-blue-600 hover:text-blue-800">Balance Sheet</Link></li>
            <li><Link to="/profit-and-loss" className="text-blue-600 hover:text-blue-800">Profit & Loss</Link></li>
            <li><Link to="/templates" className="text-blue-600 hover:text-blue-800">Templates</Link></li>
            <li><Link to="/import" className="text-blue-600 hover:text-blue-800">Import</Link></li>
            <li><Link to="/year-management" className="text-blue-600 hover:text-blue-800">Year Management</Link></li>
            <li><Link to="/opening-balances" className="text-blue-600 hover:text-blue-800">Opening Balances</Link></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {fiscalYears.length > 0 && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Fiscal Year" />
              </SelectTrigger>
              <SelectContent>
                {fiscalYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {session ? (
            <Button onClick={handleSignOut}>Sign Out</Button>
          ) : (
            <Link to="/" className="text-blue-600 hover:text-blue-800">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header