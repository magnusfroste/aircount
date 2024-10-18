import React, { useMemo } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useOpeningBalances } from '../integrations/supabase/hooks/openingBalances'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from '../utils/numberFormatting'
import { useFiscalYear } from '../contexts/FiscalYearContext'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const BalanceSheet = () => {
  const { session } = useSupabaseAuth()
  const { selectedYear } = useFiscalYear()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id, 'desc', selectedYear)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  const { data: openingBalances, isLoading: openingBalancesLoading, error: openingBalancesError } = useOpeningBalances(session?.user?.id, selectedYear)

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

  if (!session) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          You must be logged in to view the balance sheet.
        </AlertDescription>
      </Alert>
    )
  }

  if (!selectedYear) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Fiscal Year Not Selected</AlertTitle>
        <AlertDescription>
          Please select a fiscal year to view the balance sheet.
        </AlertDescription>
      </Alert>
    )
  }

  if (transactionsLoading || accountsLoading || openingBalancesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading balance sheet data...</span>
      </div>
    )
  }

  if (transactionsError || accountsError || openingBalancesError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>
          {transactionsError?.message || accountsError?.message || openingBalancesError?.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (!transactions?.length || !accounts?.length || !openingBalances?.length || !balanceSheetData) {
    return (
      <Alert>
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          There is no data available for the balance sheet. Please ensure you have transactions, accounts, and opening balances for the selected fiscal year ({selectedYear}).
        </AlertDescription>
      </Alert>
    )
  }

  const renderCategory = (category, depth = 0) => {
    if (Array.isArray(category.accounts)) {
      return category.accounts.map(({ account, name, openingBalance, change, closingBalance }) => (
        <TableRow key={account}>
          <TableCell className={`pl-${depth * 4}`}>{account} - {name}</TableCell>
          <TableCell className="text-right">{formatNumber(openingBalance.toFixed(2))}</TableCell>
          <TableCell className="text-right">{formatNumber(change.toFixed(2))}</TableCell>
          <TableCell className="text-right">{formatNumber(closingBalance.toFixed(2))}</TableCell>
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
                <TableCell className="text-right">{formatNumber(assetsTotals.openingBalance.toFixed(2))}</TableCell>
                <TableCell className="text-right">{formatNumber(assetsTotals.change.toFixed(2))}</TableCell>
                <TableCell className="text-right">{formatNumber(assetsTotals.closingBalance.toFixed(2))}</TableCell>
              </TableRow>
              {renderCategory(balanceSheetData['Equity and Liabilities'])}
              <TableRow className="font-bold">
                <TableCell>Total Equity and Liabilities</TableCell>
                <TableCell className="text-right">{formatNumber(equityLiabilitiesTotals.openingBalance.toFixed(2))}</TableCell>
                <TableCell className="text-right">{formatNumber(equityLiabilitiesTotals.change.toFixed(2))}</TableCell>
                <TableCell className="text-right">{formatNumber(equityLiabilitiesTotals.closingBalance.toFixed(2))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BalanceSheet
