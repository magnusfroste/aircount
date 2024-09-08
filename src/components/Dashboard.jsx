import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecords } from '../integrations/supabase/hooks/records'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, PieChart, Activity, Target, TrendingDown } from 'lucide-react'

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

    // Calculate year-over-year growth (simulated)
    const yoyGrowth = 15 // 15% growth

    // Calculate customer acquisition cost (simulated)
    const totalMarketingExpenses = 50000 // Simulated total marketing expenses
    const newCustomers = 100 // Simulated number of new customers
    const cac = totalMarketingExpenses / newCustomers

    // Calculate average revenue per user (simulated)
    const totalUsers = 500 // Simulated total number of users
    const arpu = totalIncome / totalUsers

    // Simulate monthly recurring revenue data
    const mrrData = [
      { month: 'Jan', mrr: 3000 },
      { month: 'Feb', mrr: 3200 },
      { month: 'Mar', mrr: 3400 },
      { month: 'Apr', mrr: 3600 },
      { month: 'May', mrr: 3800 },
      { month: 'Jun', mrr: 4000 },
    ]

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      chartData,
      yoyGrowth,
      cac,
      arpu,
      mrrData
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
            +{financialStats.yoyGrowth}% from last year
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
            +2.5% from last month
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
            +18.7% from last quarter
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
            +3.2% from last year
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
          <CardTitle className="text-sm font-medium">Key Performance Indicators</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">YoY Growth</dt>
              <dd className="text-2xl font-bold">{financialStats.yoyGrowth}%</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Customer Acquisition Cost</dt>
              <dd className="text-2xl font-bold">${financialStats.cac.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Avg. Revenue Per User</dt>
              <dd className="text-2xl font-bold">${financialStats.arpu.toFixed(2)}</dd>
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
          <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialStats.mrrData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mrr" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard