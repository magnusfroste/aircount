import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { useSupabaseAuth } from './integrations/supabase/auth'
import Login from './components/Login'
import Index from './pages/Index'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AccountsPage from './pages/AccountsPage'
import TemplatesPage from './pages/TemplatesPage'
import BalanceSheetPage from './pages/BalanceSheetPage'
import ProfitAndLossPage from './pages/ProfitAndLossPage'
import LedgerPage from './pages/LedgerPage'
import OpeningBalancesPage from './pages/OpeningBalancesPage'
import YearManagementPage from './pages/YearManagementPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  const { session } = useSupabaseAuth()

  if (!session) {
    return <Login />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/balance-sheet" element={<BalanceSheetPage />} />
        <Route path="/profit-and-loss" element={<ProfitAndLossPage />} />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/opening-balances" element={<OpeningBalancesPage />} />
        <Route path="/year-management" element={<YearManagementPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App