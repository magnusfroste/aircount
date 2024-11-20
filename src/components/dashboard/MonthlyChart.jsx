import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const MonthlyChart = ({ transactions, accounts }) => {
  const monthlyData = useMemo(() => {
    const data = Array(12).fill().map((_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      income: 0,
      expenses: 0
    }))

    transactions.forEach(t => {
      const account = accounts?.find(a => a.account === t.account)
      if (account) {
        const month = new Date(t.date).getMonth()
        
        // Income accounts (3xxx and 8220)
        if (/^3\d{3}/.test(account.account) || account.account === '8220') {
          data[month].income += (t.credit - t.debit)
        }
        // Expense accounts (4xxx-7xxx)
        else if (/^[4567]\d{3}/.test(account.account)) {
          data[month].expenses += (t.debit - t.credit)
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