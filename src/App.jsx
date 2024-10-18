import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth'
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

const ProtectedRoute = ({ children }) => {
  const { session } = useSupabaseAuth()
  if (!session) {
    return <Navigate to="/" replace />
  }
  return children
}

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
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
                <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
                <Route path="/balance-sheet" element={<ProtectedRoute><BalanceSheetPage /></ProtectedRoute>} />
                <Route path="/profit-and-loss" element={<ProtectedRoute><ProfitAndLossPage /></ProtectedRoute>} />
                <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
                <Route path="/import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
                <Route path="/year-management" element={<ProtectedRoute><YearManagementPage /></ProtectedRoute>} />
                <Route path="/opening-balances" element={<ProtectedRoute><OpeningBalancesPage /></ProtectedRoute>} />
              </Routes>
            </div>
          </Router>
        </FiscalYearProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  )
}

export default App