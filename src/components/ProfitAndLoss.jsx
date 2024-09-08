import React, { useMemo } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ProfitAndLoss = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: accountsData, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id, 1, 50, true)

  const plStatement = useMemo(() => {
    if (!transactions || !accountsData || !Array.isArray(accountsData.data)) return null

    const accountMap = accountsData.data.reduce((acc, account) => {
      acc[account.account] = account.account_name
      return acc
    }, {})

    const accountSums = transactions.reduce((acc, transaction) => {
      const account = transaction.account
      const amount = transaction.debit - transaction.credit
      acc[account] = (acc[account] || 0) + amount
      return acc
    }, {})

    const categories = {
      'Income': ['3', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
      'Costs': ['4', '5', '6', '7'],
      'Financial Income': ['8314'],
      'Taxes': ['8910'],
      'Net Income': []
    }

    const plData = Object.entries(categories).map(([category, prefixes]) => {
      const accounts = Object.entries(accountSums)
        .filter(([account, sum]) => 
          prefixes.some(prefix => account.startsWith(prefix)) && sum !== 0
        )
        .map(([account, sum]) => ({ account, accountName: accountMap[account] || 'Unknown', sum }))
      
      const sum = accounts.reduce((acc, { sum }) => acc + sum, 0)
      return { category, sum, accounts }
    })

    const totalIncome = plData.find(item => item.category === 'Income')?.sum || 0
    const totalCosts = plData.find(item => item.category === 'Costs')?.sum || 0
    const financialIncome = plData.find(item => item.category === 'Financial Income')?.sum || 0
    const taxes = plData.find(item => item.category === 'Taxes')?.sum || 0
    const netIncome = totalIncome + totalCosts + financialIncome + taxes

    plData.find(item => item.category === 'Net Income').sum = netIncome

    return { plData, totalIncome, totalCosts, financialIncome, taxes, netIncome }
  }, [transactions, accountsData])

  if (transactionsLoading || accountsLoading) return <div>Loading P&L statement...</div>
  if (transactionsError) return <div>Error loading transactions: {transactionsError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>
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
                <TableHead>Account</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead className="text-right">Amount (SEK)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plStatement.plData.map(({ category, sum, accounts }) => (
                <React.Fragment key={category}>
                  <TableRow className="font-medium">
                    <TableCell>{category}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">{sum.toFixed(2)}</TableCell>
                  </TableRow>
                  {accounts.map(({ account, accountName, sum }) => (
                    <TableRow key={account}>
                      <TableCell className="pl-8"></TableCell>
                      <TableCell>{account}</TableCell>
                      <TableCell>{accountName}</TableCell>
                      <TableCell className="text-right">{sum.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
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
                <TableCell>Total Income</TableCell>
                <TableCell className="text-right">{plStatement.totalIncome.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Costs</TableCell>
                <TableCell className="text-right">{plStatement.totalCosts.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Financial Income</TableCell>
                <TableCell className="text-right">{plStatement.financialIncome.toFixed(2)}</TableCell>
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