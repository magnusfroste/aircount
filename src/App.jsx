import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SupabaseAuthProvider } from './integrations/supabase/auth'
import { FiscalYearProvider } from './contexts/FiscalYearContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AccountsPage from './pages/AccountsPage'
import BalanceSheetPage from './pages/BalanceSheetPage'
import ProfitAndLossPage from './pages/ProfitAndLossPage'
import TemplatesPage from './pages/TemplatesPage'
import ImportPage from './pages/ImportPage'
import YearManagementPage from './pages/YearManagementPage'
import OpeningBalancesPage from './pages/OpeningBalancesPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <FiscalYearProvider>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <Header />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/balance-sheet" element={<BalanceSheetPage />} />
                <Route path="/profit-and-loss" element={<ProfitAndLossPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/year-management" element={<YearManagementPage />} />
                <Route path="/opening-balances" element={<OpeningBalancesPage />} />
              </Routes>
            </div>
          </Router>
        </FiscalYearProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  )
}

export default App