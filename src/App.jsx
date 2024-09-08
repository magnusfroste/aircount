import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth';
import Login from './components/Login';
import Index from './pages/Index';
import EventsPage from './pages/EventsPage';
import Navigation from './components/Navigation';
import TransactionsPage from './pages/TransactionsPage';
import AccountsPage from './pages/AccountsPage';
import ProfitAndLossPage from './pages/ProfitAndLossPage';
import LedgerPage from './pages/LedgerPage';
import BalanceSheetPage from './pages/BalanceSheetPage';
import OpeningBalancesPage from './pages/OpeningBalancesPage';
import ImportPage from './pages/ImportPage';
import LandingPage from './components/LandingPage';

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
  const { session } = useSupabaseAuth();

  return (
    <>
      {session && <Navigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
        <Route path="/profit-and-loss" element={<ProtectedRoute><ProfitAndLossPage /></ProtectedRoute>} />
        <Route path="/ledger" element={<ProtectedRoute><LedgerPage /></ProtectedRoute>} />
        <Route path="/balance-sheet" element={<ProtectedRoute><BalanceSheetPage /></ProtectedRoute>} />
        <Route path="/opening-balances" element={<ProtectedRoute><OpeningBalancesPage /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

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