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

  if (transactionsLoading || accountsLoading) return <div className="text-center text-lg text-blue-600">Loading dashboard...</div>
  if (transactionsError || accountsError) return <div className="text-center text-lg text-red-600">Error loading dashboard data</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-lg">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Financial Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FinancialOverview transactions={transactions} accounts={accounts} />
        </div>
      </div>
      <Card className="md:col-span-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-indigo-600">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyChart transactions={transactions} accounts={accounts} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard