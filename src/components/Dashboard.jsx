import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import FinancialOverview from './dashboard/FinancialOverview'
import MonthlyChart from './dashboard/MonthlyChart'
import QuickAccountView from './dashboard/QuickAccountView'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const Dashboard = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  
  const { data: companyData } = useQuery({
    queryKey: ['company', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      const { data, error } = await supabase
        .from('companies')
        .select('company_name')
        .eq('user_id', session.user.id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id
  })

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
      
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Quick Account Overview</h2>
        <QuickAccountView transactions={transactions} accounts={accounts} />
      </div>

      <Card className="md:col-span-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-indigo-600">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyChart transactions={transactions} accounts={accounts} />
        </CardContent>
      </Card>
      
      {/* Development only - Company name display */}
      <div className="md:col-span-2 p-4 bg-yellow-100 rounded-lg text-center">
        <p className="text-yellow-800">Development Info - Company Name: {companyData?.company_name || 'Loading...'}</p>
      </div>
    </div>
  )
}

export default Dashboard