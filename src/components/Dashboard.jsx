import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecords } from '../integrations/supabase/hooks/records'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, PieChart, Activity } from 'lucide-react'

const Dashboard = () => {
  const { session } = useSupabaseAuth()
  const { data: records, isLoading: recordsLoading, error: recordsError } = useRecords(session?.user?.id)
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)

  const financialStats = useMemo(() => {
    if (!transactions || !accounts) return null

    const totalIncome = transactions.reduce((sum, t) => sum + (t.credit > 0 ? t.credit : 0), 0)
    const totalExpenses = transactions.reduce((sum, t) => sum + (t.debit > 0 ? t.debit : 0), 0)
    const netProfit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

    const accountCategories = {
      assets: ['1'],
      liabilities: ['2'],
      equity: ['3'],
      income: ['3'],
      expenses: ['4', '5', '6', '7']
    }

    const categorySums = Object.entries(accountCategories).reduce((acc, [category, prefixes]) => {
      acc[category] = transactions.reduce((sum, t) => {
        if (prefixes.some(prefix => t.account.startsWith(prefix))) {
          return sum + (t.debit - t.credit)
        }
        return sum
      }, 0)
      return acc
    }, {})

    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' })
      if (!acc[month]) acc[month] = { income: 0, expenses: 0 }
      acc[month].income += t.credit
      acc[month].expenses += t.debit
      return acc
    }, {})

    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses
    }))

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      categorySums,
      chartData
    }
  }, [transactions, accounts])

  if (recordsLoading || transactionsLoading || accountsLoading) return <div>Loading dashboard...</div>
  if (recordsError || transactionsError || accountsError) return <div>Error loading dashboard data</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${financialStats.totalIncome.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${financialStats.totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            -4.5% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${financialStats.netProfit.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            +12.3% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialStats.profitMargin.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">
            +2.5% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialStats.chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#8884d8" name="Income" />
              <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Financial Health Indicators</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Assets</dt>
              <dd className="text-2xl font-bold">${Math.abs(financialStats.categorySums.assets).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Liabilities</dt>
              <dd className="text-2xl font-bold">${Math.abs(financialStats.categorySums.liabilities).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Equity</dt>
              <dd className="text-2xl font-bold">${Math.abs(financialStats.categorySums.equity).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Expense Ratio</dt>
              <dd className="text-2xl font-bold">
                {(financialStats.totalExpenses / financialStats.totalIncome * 100).toFixed(2)}%
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Total Accounts</dt>
              <dd className="text-2xl font-bold">{accounts.length}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Total Transactions</dt>
              <dd className="text-2xl font-bold">{transactions.length}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Avg Transaction Value</dt>
              <dd className="text-2xl font-bold">
                ${(financialStats.totalIncome / transactions.length).toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Records</dt>
              <dd className="text-2xl font-bold">{records.length}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard