import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from 'date-fns'
import { formatNumber } from '../../utils/formatUtils'

const IMPORTANT_ACCOUNTS = [
  { number: '1930', name: 'Bank' },
  { number: '2440', name: 'Leverantörsskulder' },
  { number: '1510', name: 'Kundfordringar' }
]

const QuickAccountView = ({ transactions, accounts }) => {
  const getAccountTransactions = (accountNumber) => {
    return transactions
      .filter(t => t.account === accountNumber)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
  }

  const calculateAccountBalance = (accountNumber) => {
    return transactions
      .filter(t => t.account === accountNumber)
      .reduce((sum, t) => sum + (t.debit - t.credit), 0)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {IMPORTANT_ACCOUNTS.map(account => {
        const recentTransactions = getAccountTransactions(account.number)
        const balance = calculateAccountBalance(account.number)
        
        return (
          <Card key={account.number} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                {account.number} - {account.name}
              </CardTitle>
              <p className="text-xl font-bold text-blue-600">{formatNumber(balance)} SEK</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Recent Transactions:</p>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((t, index) => (
                    <div key={index} className="text-sm border-b last:border-0 pb-1">
                      <div className="flex justify-between">
                        <span>{format(new Date(t.date), 'yyyy-MM-dd')}</span>
                        <span className={t.debit > t.credit ? 'text-green-600' : 'text-red-600'}>
                          {t.debit > t.credit ? '+' : '-'}{formatNumber(Math.abs(t.debit - t.credit))}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No recent transactions</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default QuickAccountView