import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowDownRight, TrendingUp, PieChart } from 'lucide-react'

const FinancialOverview = ({ transactions = [], accounts = [] }) => {
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

  const cards = [
    { title: "Total Income", value: financialStats.totalIncome, icon: DollarSign, color: "text-green-600" },
    { title: "Total Expenses", value: financialStats.totalExpenses, icon: ArrowDownRight, color: "text-red-600" },
    { title: "Net Profit", value: financialStats.netProfit, icon: TrendingUp, color: "text-blue-600" },
    { title: "Profit Margin", value: `${financialStats.profitMargin.toFixed(2)}%`, icon: PieChart, color: "text-purple-600" }
  ]

  return (
    <>
      {cards.map((card, index) => (
        <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {typeof card.value === 'number' ? card.value.toFixed(2) : card.value} {card.title !== "Profit Margin" && "SEK"}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default FinancialOverview