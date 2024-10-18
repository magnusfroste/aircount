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

  const cardStyles = [
    "bg-gradient-to-br from-green-100 to-green-200 shadow-md hover:shadow-lg transition-shadow duration-300",
    "bg-gradient-to-br from-red-100 to-red-200 shadow-md hover:shadow-lg transition-shadow duration-300",
    "bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300",
    "bg-gradient-to-br from-purple-100 to-purple-200 shadow-md hover:shadow-lg transition-shadow duration-300"
  ]

  return (
    <>
      <Card className={cardStyles[0]}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Total Income</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">{financialStats.totalIncome.toFixed(2)} SEK</div>
        </CardContent>
      </Card>
      <Card className={cardStyles[1]}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700">Total Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-800">{financialStats.totalExpenses.toFixed(2)} SEK</div>
        </CardContent>
      </Card>
      <Card className={cardStyles[2]}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Net Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">{financialStats.netProfit.toFixed(2)} SEK</div>
        </CardContent>
      </Card>
      <Card className={cardStyles[3]}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Profit Margin</CardTitle>
          <PieChart className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800">{financialStats.profitMargin.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </>
  )
}

export default FinancialOverview