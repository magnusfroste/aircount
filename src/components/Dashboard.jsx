import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, PieChart, Activity, Target, TrendingDown } from 'lucide-react'
import { StatCard, ChartCard, KPICard } from './DashboardComponents'

const Dashboard = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: accountsData, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)

  const financialStats = useMemo(() => {
    if (!transactions || !accountsData || !Array.isArray(accountsData.data)) return null

    const accounts = accountsData.data || []
    const totalIncome = 4000 // Single transaction of 4000 SEK for 2023

    const totalExpenses = transactions.reduce((sum, t) => {
      const account = accounts.find(a => a.account === t.account)
      if (account && (account.account.startsWith('4') || account.account.startsWith('5') || account.account.startsWith('6') || account.account.startsWith('7'))) {
        return sum + (t.debit > 0 ? t.debit : 0)
      }
      return sum
    }, 0)

    const netProfit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

    const monthlyExpenses = transactions.reduce((acc, t) => {
      const account = accounts.find(a => a.account === t.account)
      if (account && (account.account.startsWith('4') || account.account.startsWith('5') || account.account.startsWith('6') || account.account.startsWith('7'))) {
        const month = new Date(t.date).getMonth()
        acc[month] = (acc[month] || 0) + (t.debit > 0 ? t.debit : 0)
      }
      return acc
    }, Array(12).fill(0))

    const monthlyData = [
      { month: 'Jan', income: 4000, expenses: monthlyExpenses[0] },
      { month: 'Feb', income: 0, expenses: monthlyExpenses[1] },
      { month: 'Mar', income: 0, expenses: monthlyExpenses[2] },
      { month: 'Apr', income: 0, expenses: monthlyExpenses[3] },
      { month: 'May', income: 0, expenses: monthlyExpenses[4] },
      { month: 'Jun', income: 0, expenses: monthlyExpenses[5] },
      { month: 'Jul', income: 0, expenses: monthlyExpenses[6] },
      { month: 'Aug', income: 0, expenses: monthlyExpenses[7] },
      { month: 'Sep', income: 0, expenses: monthlyExpenses[8] },
      { month: 'Oct', income: 0, expenses: monthlyExpenses[9] },
      { month: 'Nov', income: 0, expenses: monthlyExpenses[10] },
      { month: 'Dec', income: 0, expenses: monthlyExpenses[11] },
    ]

    const yoyGrowth = 15 // 15% growth (simulated)
    const totalMarketingExpenses = 50000 // Simulated total marketing expenses
    const newCustomers = 100 // Simulated number of new customers
    const cac = totalMarketingExpenses / newCustomers
    const totalUsers = 500 // Simulated total number of users
    const arpu = totalIncome / totalUsers

    const mrrData = Array(12).fill(0).map((_, index) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
      mrr: 4000
    }))

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      monthlyData,
      yoyGrowth,
      cac,
      arpu,
      mrrData
    }
  }, [transactions, accountsData])

  if (transactionsLoading || accountsLoading) return <div>Loading dashboard...</div>
  if (transactionsError || accountsError) return <div>Error loading dashboard data</div>
  if (!financialStats) return <div>No financial data available</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Income" value={financialStats.totalIncome} icon={<DollarSign />} change={financialStats.yoyGrowth} />
      <StatCard title="Total Expenses" value={financialStats.totalExpenses} icon={<ArrowDownRight />} change={2.5} />
      <StatCard title="Net Profit" value={financialStats.netProfit} icon={<TrendingUp />} change={18.7} />
      <StatCard title="Profit Margin" value={financialStats.profitMargin} icon={<PieChart />} change={3.2} suffix="%" />
      <ChartCard title="Monthly Income vs Expenses" data={financialStats.monthlyData} />
      <KPICard
        title="Key Performance Indicators"
        kpis={[
          { label: "YoY Growth", value: `${financialStats.yoyGrowth}%` },
          { label: "Customer Acquisition Cost", value: `${financialStats.cac.toFixed(2)} SEK` },
          { label: "Avg. Revenue Per User", value: `${financialStats.arpu.toFixed(2)} SEK` },
          { label: "Expense Ratio", value: `${(financialStats.totalExpenses / financialStats.totalIncome * 100).toFixed(2)}%` }
        ]}
      />
      <ChartCard title="Monthly Recurring Revenue" data={financialStats.mrrData} type="line" />
    </div>
  )
}

export default Dashboard