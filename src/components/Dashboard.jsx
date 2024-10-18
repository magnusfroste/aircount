import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import FinancialOverview from './dashboard/FinancialOverview'
import MonthlyChart from './dashboard/MonthlyChart'

const Dashboard = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)

  if (transactionsLoading || accountsLoading) return <div>Loading dashboard...</div>
  if (transactionsError || accountsError) return <div>Error loading dashboard data</div>

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FinancialOverview transactions={transactions} accounts={accounts} />
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyChart transactions={transactions} accounts={accounts} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard