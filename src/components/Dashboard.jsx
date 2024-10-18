import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import FinancialOverview from './dashboard/FinancialOverview'
import MonthlyChart from './dashboard/MonthlyChart'
import { useFiscalYear } from '../contexts/FiscalYearContext'

const Dashboard = () => {
  const { session } = useSupabaseAuth()
  const { selectedYear } = useFiscalYear()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id, 'desc', selectedYear)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)

  if (transactionsLoading || accountsLoading) return <div className="text-center py-8">Loading dashboard...</div>
  if (transactionsError || accountsError) return <div className="text-center py-8 text-red-600">Error loading dashboard data</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <FinancialOverview transactions={transactions || []} accounts={accounts || []} />
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <MonthlyChart transactions={transactions || []} accounts={accounts || []} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard