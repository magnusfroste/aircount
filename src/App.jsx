import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
import Header from './components/Header'

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSupabaseAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppContent() {
  const { session, loading } = useSupabaseAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <Login />
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
        <Route path="/balance-sheet" element={<ProtectedRoute><BalanceSheetPage /></ProtectedRoute>} />
        <Route path="/profit-and-loss" element={<ProtectedRoute><ProfitAndLossPage /></ProtectedRoute>} />
        <Route path="/ledger" element={<ProtectedRoute><LedgerPage /></ProtectedRoute>} />
        <Route path="/opening-balances" element={<ProtectedRoute><OpeningBalancesPage /></ProtectedRoute>} />
        <Route path="/year-management" element={<ProtectedRoute><YearManagementPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
      <Toaster />
    </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <AppContent />
      </SupabaseAuthProvider>
    </QueryClientProvider>
  )
}

export default App