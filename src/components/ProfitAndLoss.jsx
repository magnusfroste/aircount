import React, { useMemo } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from '../utils/formatUtils'

const ProfitAndLoss = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)

  const plStatement = useMemo(() => {
    if (!transactions || !accounts) return null

    const accountMap = accounts.reduce((acc, account) => {
      acc[account.account] = account.account_name
      return acc
    }, {})

    const accountSums = transactions.reduce((acc, transaction) => {
      const account = transaction.account
      const amount = transaction.credit - transaction.debit
      acc[account] = (acc[account] || 0) + amount
      return acc
    }, {})

    // Categories according to BAS 2020
    const categories = {
      'Operating Income': {
        prefixes: ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
        description: 'Net sales and other operating income'
      },
      'Cost of Goods Sold': {
        prefixes: ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49'],
        description: 'Direct costs related to production'
      },
      'Other External Costs': {
        prefixes: ['50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
        description: 'External expenses'
      },
      'Personnel Costs': {
        prefixes: ['70', '71', '72', '73', '74', '75', '76'],
        description: 'Salaries and social security expenses'
      },
      'Depreciation': {
        prefixes: ['77', '78', '79'],
        description: 'Depreciation and write-downs'
      },
      'Financial Income': {
        prefixes: ['82', '83'],
        accounts: ['8220'],
        description: 'Interest income and similar profit/loss items'
      },
      'Financial Expenses': {
        prefixes: ['84'],
        description: 'Interest expenses and similar profit/loss items'
      },
      'Income Tax': {
        prefixes: ['88', '89'],
        description: 'Tax on profit for the year'
      }
    }

    const plData = Object.entries(categories).map(([category, { prefixes, accounts: specificAccounts = [], description }]) => {
      const relevantAccounts = Object.entries(accountSums)
        .filter(([account, sum]) => (
          (prefixes.some(prefix => account.startsWith(prefix)) || 
           (specificAccounts && specificAccounts.includes(account))) && 
          sum !== 0
        ))
        .map(([account, sum]) => ({ 
          account, 
          accountName: accountMap[account] || 'Unknown', 
          sum 
        }))
      
      const sum = relevantAccounts.reduce((acc, { sum }) => acc + sum, 0)
      return { category, description, sum, accounts: relevantAccounts }
    })

    // Calculate operating profit (before financial items)
    const operatingIncome = plData.find(item => item.category === 'Operating Income')?.sum || 0
    const cogs = plData.find(item => item.category === 'Cost of Goods Sold')?.sum || 0
    const externalCosts = plData.find(item => item.category === 'Other External Costs')?.sum || 0
    const personnelCosts = plData.find(item => item.category === 'Personnel Costs')?.sum || 0
    const depreciation = plData.find(item => item.category === 'Depreciation')?.sum || 0
    
    const operatingProfit = operatingIncome + cogs + externalCosts + personnelCosts + depreciation

    // Calculate profit after financial items
    const financialIncome = plData.find(item => item.category === 'Financial Income')?.sum || 0
    const financialExpenses = plData.find(item => item.category === 'Financial Expenses')?.sum || 0
    const profitAfterFinancials = operatingProfit + financialIncome + financialExpenses

    // Calculate net profit
    const taxes = plData.find(item => item.category === 'Income Tax')?.sum || 0
    const netProfit = profitAfterFinancials + taxes

    return { 
      plData,
      operatingProfit,
      profitAfterFinancials,
      netProfit
    }
  }, [transactions, accounts])

  if (transactionsLoading || accountsLoading) return <div>Loading P&L statement...</div>
  if (transactionsError) return <div>Error loading transactions: {transactionsError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>
  if (!plStatement) return <div>No data available for P&L statement</div>

  return (
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
            {plStatement.plData.map(({ category, description, sum, accounts }) => (
              <React.Fragment key={category}>
                <TableRow className="font-medium bg-muted/50">
                  <TableCell colSpan={3}>
                    {category}
                    <span className="block text-sm text-muted-foreground">{description}</span>
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(sum)}</TableCell>
                </TableRow>
                {accounts.map(({ account, accountName, sum }) => (
                  <TableRow key={account}>
                    <TableCell className="pl-8"></TableCell>
                    <TableCell>{account}</TableCell>
                    <TableCell>{accountName}</TableCell>
                    <TableCell className="text-right">{formatNumber(sum)}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
            <TableRow className="font-bold bg-muted">
              <TableCell colSpan={3}>Operating Profit</TableCell>
              <TableCell className="text-right">{formatNumber(plStatement.operatingProfit)}</TableCell>
            </TableRow>
            <TableRow className="font-bold bg-muted">
              <TableCell colSpan={3}>Profit after Financial Items</TableCell>
              <TableCell className="text-right">{formatNumber(plStatement.profitAfterFinancials)}</TableCell>
            </TableRow>
            <TableRow className="font-bold bg-muted">
              <TableCell colSpan={3}>Net Profit</TableCell>
              <TableCell className="text-right">{formatNumber(plStatement.netProfit)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ProfitAndLoss