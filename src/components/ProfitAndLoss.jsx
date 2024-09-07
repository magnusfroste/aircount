import React, { useMemo } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ProfitAndLoss = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading, error } = useTransactions(session?.user?.id)

  const plStatement = useMemo(() => {
    if (!transactions) return null

    const accountSums = transactions.reduce((acc, transaction) => {
      const account = transaction.account
      const amount = transaction.debit - transaction.credit
      acc[account] = (acc[account] || 0) + amount
      return acc
    }, {})

    const categories = {
      'Rörelseintäkter': ['3001'],
      'Rörelsekostnader': ['6200', '6570'],
      'Finansiella poster': ['8314'],
      'Skatter': ['8910'],
      'Årets resultat': ['8999']
    }

    const plData = Object.entries(categories).map(([category, accounts]) => {
      const sum = accounts.reduce((acc, account) => acc + (accountSums[account] || 0), 0)
      return { category, sum, accounts: accounts.map(account => ({ account, sum: accountSums[account] || 0 })) }
    })

    const totalRevenue = plData.find(item => item.category === 'Rörelseintäkter')?.sum || 0
    const totalExpenses = plData.find(item => item.category === 'Rörelsekostnader')?.sum || 0
    const financialItems = plData.find(item => item.category === 'Finansiella poster')?.sum || 0
    const taxes = plData.find(item => item.category === 'Skatter')?.sum || 0
    const netIncome = totalRevenue + totalExpenses + financialItems + taxes

    return { plData, totalRevenue, totalExpenses, financialItems, taxes, netIncome }
  }, [transactions])

  if (isLoading) return <div>Loading P&L statement...</div>
  if (error) return <div>Error loading P&L statement: {error.message}</div>
  if (!plStatement) return <div>No data available for P&L statement</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profit and Loss Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount (SEK)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plStatement.plData.map(({ category, sum, accounts }) => (
                <React.Fragment key={category}>
                  <TableRow className="font-medium">
                    <TableCell>{category}</TableCell>
                    <TableCell className="text-right">{sum.toFixed(2)}</TableCell>
                  </TableRow>
                  {accounts.map(({ account, sum }) => (
                    <TableRow key={account}>
                      <TableCell className="pl-8">{account}</TableCell>
                      <TableCell className="text-right">{sum.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
              <TableRow className="font-bold">
                <TableCell>Net Income</TableCell>
                <TableCell className="text-right">{plStatement.netIncome.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total Revenue</TableCell>
                <TableCell className="text-right">{plStatement.totalRevenue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Expenses</TableCell>
                <TableCell className="text-right">{plStatement.totalExpenses.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Financial Items</TableCell>
                <TableCell className="text-right">{plStatement.financialItems.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Taxes</TableCell>
                <TableCell className="text-right">{plStatement.taxes.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Net Income</TableCell>
                <TableCell className="text-right">{plStatement.netIncome.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfitAndLoss