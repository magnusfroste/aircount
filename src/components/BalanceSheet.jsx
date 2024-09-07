import React, { useMemo } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useOpeningBalances } from '../integrations/supabase/hooks/openingBalances'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BalanceSheet = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const { data: openingBalances, isLoading: openingBalancesLoading, error: openingBalancesError } = useOpeningBalances(session?.user?.id)

  const balanceSheetData = useMemo(() => {
    if (!transactions || !openingBalances) return null

    const accountSums = transactions.reduce((acc, transaction) => {
      const account = transaction.account
      const amount = transaction.debit - transaction.credit
      acc[account] = (acc[account] || 0) + amount
      return acc
    }, {})

    const openingBalancesMap = openingBalances.reduce((acc, balance) => {
      acc[balance.account] = balance.balance
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

    const calculateSum = (accounts, balances) => {
      return accounts.reduce((sum, account) => {
        const opening = balances[account] || 0
        const change = accountSums[account] || 0
        return sum + opening + change
      }, 0)
    }

    const processCategory = (category, balances) => {
      if (Array.isArray(category)) {
        const opening = calculateSum(category, balances)
        const change = calculateSum(category, accountSums)
        const closing = opening + change
        return { opening, change, closing }
      }
      
      const result = {}
      for (const [subCategory, accounts] of Object.entries(category)) {
        result[subCategory] = processCategory(accounts, balances)
      }
      return result
    }

    const balanceSheet = {}
    for (const [mainCategory, subCategories] of Object.entries(categories)) {
      balanceSheet[mainCategory] = processCategory(subCategories, openingBalancesMap)
    }

    return balanceSheet
  }, [transactions, openingBalances])

  if (transactionsLoading || openingBalancesLoading) return <div>Loading balance sheet data...</div>
  if (transactionsError) return <div>Error loading transactions: {transactionsError.message}</div>
  if (openingBalancesError) return <div>Error loading opening balances: {openingBalancesError.message}</div>
  if (!balanceSheetData) return <div>No data available for balance sheet</div>

  const renderCategory = (category, depth = 0) => {
    if (category.opening !== undefined) {
      return (
        <TableRow key={`value-${depth}`}>
          <TableCell className={`pl-${depth * 4}`}>{category.opening.toFixed(2)}</TableCell>
          <TableCell>{category.change.toFixed(2)}</TableCell>
          <TableCell>{category.closing.toFixed(2)}</TableCell>
        </TableRow>
      )
    }

    return Object.entries(category).map(([subCategory, value]) => (
      <React.Fragment key={subCategory}>
        <TableRow>
          <TableCell className={`font-medium pl-${depth * 4}`} colSpan={3}>{subCategory}</TableCell>
        </TableRow>
        {renderCategory(value, depth + 1)}
      </React.Fragment>
    ))
  }

  const calculateTotals = (data) => {
    const totals = { opening: 0, change: 0, closing: 0 }
    Object.values(data).forEach(category => {
      Object.values(category).forEach(subCategory => {
        if (subCategory.opening !== undefined) {
          totals.opening += subCategory.opening
          totals.change += subCategory.change
          totals.closing += subCategory.closing
        } else {
          const subTotals = calculateTotals({ dummy: subCategory })
          totals.opening += subTotals.opening
          totals.change += subTotals.change
          totals.closing += subTotals.closing
        }
      })
    })
    return totals
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
                <TableHead>Opening Balance</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Closing Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderCategory(balanceSheetData)}
              <TableRow className="font-bold">
                <TableCell>Total Assets</TableCell>
                <TableCell>{assetsTotals.opening.toFixed(2)}</TableCell>
                <TableCell>{assetsTotals.change.toFixed(2)}</TableCell>
                <TableCell>{assetsTotals.closing.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Total Equity and Liabilities</TableCell>
                <TableCell>{equityLiabilitiesTotals.opening.toFixed(2)}</TableCell>
                <TableCell>{equityLiabilitiesTotals.change.toFixed(2)}</TableCell>
                <TableCell>{equityLiabilitiesTotals.closing.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BalanceSheet