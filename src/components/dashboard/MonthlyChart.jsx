import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const MonthlyChart = ({ transactions = [], accounts = [] }) => {
  const monthlyData = useMemo(() => {
    const data = Array(12).fill().map((_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      income: 0,
      expenses: 0
    }))

    transactions.forEach(t => {
      const account = accounts.find(a => a.account === t.account)
      const month = new Date(t.date).getMonth()
      if (account) {
        if (account.account.startsWith('3')) {
          data[month].income += t.credit
        } else if (account.account.startsWith('4') || account.account.startsWith('5') || account.account.startsWith('6') || account.account.startsWith('7')) {
          data[month].expenses += t.debit
        }
      }
    })

    return data
  }, [transactions, accounts])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="income" fill="#8884d8" name="Income" />
        <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default MonthlyChart