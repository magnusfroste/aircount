import React, { useMemo } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BalanceSheet = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading, error } = useTransactions(session?.user?.id)

  const balanceSheetData = useMemo(() => {
    if (!transactions) return null

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
      return accounts.reduce((sum, account) => sum + (accountSums[account] || 0), 0)
    }

    const processCategory = (category) => {
      if (Array.isArray(category)) {
        return calculateSum(category)
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
  }, [transactions])

  if (isLoading) return <div>Loading balance sheet data...</div>
  if (error) return <div>Error loading balance sheet data: {error.message}</div>
  if (!balanceSheetData) return <div>No data available for balance sheet</div>

  const renderCategory = (category, depth = 0) => {
    if (typeof category === 'number') {
      return (
        <TableRow key={`value-${depth}`}>
          <TableCell className={`pl-${depth * 4}`}>{category.toFixed(2)}</TableCell>
        </TableRow>
      )
    }

    return Object.entries(category).map(([subCategory, value]) => (
      <React.Fragment key={subCategory}>
        <TableRow>
          <TableCell className={`font-medium pl-${depth * 4}`}>{subCategory}</TableCell>
          {typeof value === 'number' && <TableCell>{value.toFixed(2)}</TableCell>}
        </TableRow>
        {typeof value === 'object' && renderCategory(value, depth + 1)}
      </React.Fragment>
    ))
  }

  const totalAssets = balanceSheetData.Assets.Fixed_Assets + 
    balanceSheetData.Assets.Current_Assets.Accounts_Receivable + 
    balanceSheetData.Assets.Current_Assets.Cash_and_Bank

  const totalEquityAndLiabilities = 
    balanceSheetData['Equity and Liabilities'].Equity.Share_Capital +
    balanceSheetData['Equity and Liabilities'].Equity.Reserves +
    balanceSheetData['Equity and Liabilities'].Equity.Retained_Earnings +
    balanceSheetData['Equity and Liabilities'].Equity['Profit/Loss for the Year'] +
    balanceSheetData['Equity and Liabilities'].Liabilities.Tax_Liabilities +
    balanceSheetData['Equity and Liabilities'].Liabilities.Other_Liabilities

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
                <TableHead className="text-right">Amount (SEK)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderCategory(balanceSheetData)}
              <TableRow className="font-bold">
                <TableCell>Total Assets</TableCell>
                <TableCell className="text-right">{totalAssets.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Total Equity and Liabilities</TableCell>
                <TableCell className="text-right">{totalEquityAndLiabilities.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BalanceSheet