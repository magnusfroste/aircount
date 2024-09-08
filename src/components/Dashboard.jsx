import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const Dashboard = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading, error } = useTransactions(session?.user?.id)

  const statistics = useMemo(() => {
    if (!transactions) return null

    const totalTransactions = transactions.length
    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0)
    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0)
    const uniqueAccounts = new Set(transactions.map(t => t.account)).size

    return {
      totalTransactions,
      totalDebit,
      totalCredit,
      uniqueAccounts
    }
  }, [transactions])

  if (isLoading) return <div>Loading dashboard...</div>
  if (error) return <div>Error loading dashboard: {error.message}</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{statistics?.totalTransactions || 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Debit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{statistics?.totalDebit.toFixed(2) || '0.00'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Credit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{statistics?.totalCredit.toFixed(2) || '0.00'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Unique Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{statistics?.uniqueAccounts || 0}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard