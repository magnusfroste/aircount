import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth'
import Login from './components/Login'
import Header from './components/Header'
import TransactionsPage from './pages/TransactionsPage'
import AccountsPage from './pages/AccountsPage'
import ProfitAndLossPage from './pages/ProfitAndLossPage'
import LedgerPage from './pages/LedgerPage'
import BalanceSheetPage from './pages/BalanceSheetPage'
import OpeningBalancesPage from './pages/OpeningBalancesPage'
import ImportPage from './pages/ImportPage'
import ImportCSVPage from './pages/ImportCSVPage'
import ImportSebPage from './pages/ImportSebPage'
import ExportPage from './pages/ExportPage'
import AutoPage from './pages/AutoPage'
import LandingPage from './components/LandingPage'
import DashboardPage from './pages/DashboardPage'
import TemplatesPage from './pages/TemplatesPage'
import ProfilePage from './pages/ProfilePage'
import SIE5Page from './pages/SIE5Page'

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSupabaseAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { session } = useSupabaseAuth()

  return (
    <>
      <Header />
      <div className={session ? "pl-64" : ""}>
        <Routes>
          <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
          <Route path="/profit-and-loss" element={<ProtectedRoute><ProfitAndLossPage /></ProtectedRoute>} />
          <Route path="/ledger" element={<ProtectedRoute><LedgerPage /></ProtectedRoute>} />
          <Route path="/balance-sheet" element={<ProtectedRoute><BalanceSheetPage /></ProtectedRoute>} />
          <Route path="/opening-balances" element={<ProtectedRoute><OpeningBalancesPage /></ProtectedRoute>} />
          <Route path="/import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
          <Route path="/import-csv" element={<ProtectedRoute><ImportCSVPage /></ProtectedRoute>} />
          <Route path="/import-seb" element={<ProtectedRoute><ImportSebPage /></ProtectedRoute>} />
          <Route path="/export" element={<ProtectedRoute><ExportPage /></ProtectedRoute>} />
          <Route path="/auto" element={<ProtectedRoute><AutoPage /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/sie5" element={<ProtectedRoute><SIE5Page /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
