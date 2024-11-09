import React, { useMemo } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useOpeningBalances } from '../integrations/supabase/hooks/openingBalances'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from '../utils/formatUtils'

const BalanceSheet = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  const { data: openingBalances, isLoading: openingBalancesLoading, error: openingBalancesError } = useOpeningBalances(session?.user?.id)

  const balanceSheetData = useMemo(() => {
    if (!transactions || !accounts || !openingBalances) return null

    const accountMap = accounts.reduce((acc, account) => {
      acc[account.account] = account.account_name
      return acc
    }, {})

    const openingBalancesMap = openingBalances.reduce((acc, balance) => {
      acc[balance.account] = balance.balance
      return acc
    }, {})

    const accountSums = transactions.reduce((acc, transaction) => {
      const account = transaction.account
      const amount = transaction.debit - transaction.credit
      acc[account] = (acc[account] || 0) + amount
      return acc
    }, {})

    const categories = {
      'Assets': {
        'Fixed Assets': ['1350', '1351'],
        'Current Assets': {
          'Accounts Receivable': ['1630', '1640'],
          'Cash and Bank': ['1930']
        }
      },
      'Equity and Liabilities': {
        'Equity': {
          'Share Capital': ['2081'],
          'Reserves': ['2086'],
          'Retained Earnings': ['2091', '2098'],
          'Profit/Loss for the Year': ['2099']
        },
        'Liabilities': {
          'Tax Liabilities': ['2510'],
          'Other Liabilities': ['2611', '2640', '2650']
        }
      }
    }

    const calculateSum = (accounts) => {
      return accounts.reduce((sum, account) => {
        const openingBalance = openingBalancesMap[account] || 0
        const change = accountSums[account] || 0
        return sum + openingBalance + change
      }, 0)
    }

    const processCategory = (category) => {
      if (Array.isArray(category)) {
        const sum = calculateSum(category)
        const accounts = category.map(account => ({
          account,
          name: accountMap[account] || 'Unknown',
          openingBalance: openingBalancesMap[account] || 0,
          change: accountSums[account] || 0,
          closingBalance: (openingBalancesMap[account] || 0) + (accountSums[account] || 0)
        }))
        return { sum, accounts }
      }
      
      const result = {}
      for (const [subCategory, accounts] of Object.entries(category)) {
        result[subCategory] = processCategory(accounts)
      }
      return result
    }

    const balanceSheet = {}
    for (const [mainCategory, subCategories] of Object.entries(categories)) {
      balanceSheet[mainCategory] = processCategory(subCategories)
    }

    return balanceSheet
  }, [transactions, accounts, openingBalances])

  if (transactionsLoading || accountsLoading || openingBalancesLoading) return <div>Loading balance sheet data...</div>
  if (transactionsError) return <div>Error loading transactions: {transactionsError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>
  if (openingBalancesError) return <div>Error loading opening balances: {openingBalancesError.message}</div>
  if (!balanceSheetData) return <div>No data available for balance sheet</div>

  const renderCategory = (category, depth = 0) => {
    if (Array.isArray(category.accounts)) {
      return category.accounts.map(({ account, name, openingBalance, change, closingBalance }) => (
        <TableRow key={account}>
          <TableCell className={`pl-${depth * 4}`}>{account} - {name}</TableCell>
          <TableCell className="text-right">{formatNumber(openingBalance)}</TableCell>
          <TableCell className="text-right">{formatNumber(change)}</TableCell>
          <TableCell className="text-right">{formatNumber(closingBalance)}</TableCell>
        </TableRow>
      ))
    }

    return Object.entries(category).flatMap(([subCategory, value]) => [
      <TableRow key={subCategory}>
        <TableCell className={`font-medium pl-${depth * 4}`} colSpan={4}>{subCategory}</TableCell>
      </TableRow>,
      ...renderCategory(value, depth + 1)
    ])
  }

  const calculateTotals = (category) => {
    if (category.sum !== undefined) {
      return {
        openingBalance: category.accounts.reduce((sum, account) => sum + account.openingBalance, 0),
        change: category.accounts.reduce((sum, account) => sum + account.change, 0),
        closingBalance: category.sum
      }
    }
    
    return Object.values(category).reduce((totals, subCategory) => {
      const subTotals = calculateTotals(subCategory)
      return {
        openingBalance: totals.openingBalance + subTotals.openingBalance,
        change: totals.change + subTotals.change,
        closingBalance: totals.closingBalance + subTotals.closingBalance
      }
    }, { openingBalance: 0, change: 0, closingBalance: 0 })
  }

  const assetsTotals = calculateTotals(balanceSheetData.Assets)
  const equityLiabilitiesTotals = calculateTotals(balanceSheetData['Equity and Liabilities'])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Opening Balance</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Closing Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderCategory(balanceSheetData.Assets)}
              <TableRow className="font-bold">
                <TableCell>Total Assets</TableCell>
                <TableCell className="text-right">{formatNumber(assetsTotals.openingBalance)}</TableCell>
                <TableCell className="text-right">{formatNumber(assetsTotals.change)}</TableCell>
                <TableCell className="text-right">{formatNumber(assetsTotals.closingBalance)}</TableCell>
              </TableRow>
              {renderCategory(balanceSheetData['Equity and Liabilities'])}
              <TableRow className="font-bold">
                <TableCell>Total Equity and Liabilities</TableCell>
                <TableCell className="text-right">{formatNumber(equityLiabilitiesTotals.openingBalance)}</TableCell>
                <TableCell className="text-right">{formatNumber(equityLiabilitiesTotals.change)}</TableCell>
                <TableCell className="text-right">{formatNumber(equityLiabilitiesTotals.closingBalance)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BalanceSheet
