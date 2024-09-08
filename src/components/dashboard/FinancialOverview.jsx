import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowDownRight, TrendingUp, PieChart } from 'lucide-react'

const FinancialOverview = ({ transactions, accounts }) => {
  const financialStats = useMemo(() => {
    const totalIncome = transactions.reduce((sum, t) => {
      const account = accounts.find(a => a.account === t.account)
      if (account && account.account.startsWith('3')) {
        return sum + (t.credit > 0 ? t.credit : 0)
      }
      return sum
    }, 0)

    const totalExpenses = transactions.reduce((sum, t) => {
      const account = accounts.find(a => a.account === t.account)
      if (account && (account.account.startsWith('4') || account.account.startsWith('5') || account.account.startsWith('6') || account.account.startsWith('7'))) {
        return sum + (t.debit > 0 ? t.debit : 0)
      }
      return sum
    }, 0)

    const netProfit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

    return { totalIncome, totalExpenses, netProfit, profitMargin }
  }, [transactions, accounts])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialStats.totalIncome.toFixed(2)} SEK</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialStats.totalExpenses.toFixed(2)} SEK</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialStats.netProfit.toFixed(2)} SEK</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialStats.profitMargin.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </>
  )
}

export default FinancialOverview