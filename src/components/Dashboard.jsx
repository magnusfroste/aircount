import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import FinancialOverview from './dashboard/FinancialOverview'
import MonthlyChart from './dashboard/MonthlyChart'
import KPICards from './dashboard/KPICards'
import MRRChart from './dashboard/MRRChart'

const Dashboard = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)

  if (transactionsLoading || accountsLoading) return <div>Loading dashboard...</div>
  if (transactionsError || accountsError) return <div>Error loading dashboard data</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <FinancialOverview transactions={transactions} accounts={accounts} />
      <MonthlyChart transactions={transactions} accounts={accounts} />
      <KPICards transactions={transactions} />
      <MRRChart />
    </div>
  )
}

export default Dashboard