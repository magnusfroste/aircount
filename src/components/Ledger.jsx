import React, { useState } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useOpeningBalances } from '../integrations/supabase/hooks/openingBalances'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from 'date-fns'
import { formatNumber } from '../utils/formatUtils'

const Ledger = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading } = useAccounts(session?.user?.id)
  const { data: openingBalances, isLoading: openingBalancesLoading } = useOpeningBalances(session?.user?.id)
  const [selectedAccount, setSelectedAccount] = useState('')

  if (transactionsLoading || accountsLoading || openingBalancesLoading) return <div>Loading ledger data...</div>

  const ledgerData = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.account]) {
      acc[transaction.account] = []
    }
    acc[transaction.account].push(transaction)
    return acc
  }, {})

  // Sort transactions by ver for each account
  Object.values(ledgerData).forEach(transactions => {
    transactions.sort((a, b) => {
      const verA = parseInt(a.ver) || 0
      const verB = parseInt(b.ver) || 0
      return verA - verB
    })
  })

  const getOpeningBalance = (account) => {
    const openingBalance = openingBalances?.find(balance => balance.account === account)
    if (!openingBalance) return 0
    return openingBalance.debit - openingBalance.credit
  }

  const accountBalance = (accountTransactions, account) => {
    const openingBalance = getOpeningBalance(account)
    return accountTransactions.reduce((balance, transaction) => {
      return balance + transaction.debit - transaction.credit
    }, openingBalance)
  }

  // Get all unique accounts from both transactions and opening balances
  const allAccounts = new Set([
    ...Object.keys(ledgerData),
    ...(openingBalances?.map(b => b.account) || [])
  ])

  const filteredAccounts = selectedAccount 
    ? [...allAccounts].filter(account => account.includes(selectedAccount))
    : [...allAccounts]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ledger</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter by account"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {filteredAccounts.map((account) => {
        const transactions = ledgerData[account] || []
        const openingBalance = getOpeningBalance(account)
        const accountName = accounts?.find(a => a.account === account)?.account_name

        return (
          <Card key={account} className="mb-6">
            <CardHeader>
              <CardTitle>{account} - {accountName || 'Unknown'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openingBalance !== 0 && (
                    <TableRow>
                      <TableCell colSpan={2}>Opening Balance</TableCell>
                      <TableCell className="text-right">
                        {openingBalance > 0 ? formatNumber(openingBalance) : ''}
                      </TableCell>
                      <TableCell className="text-right">
                        {openingBalance < 0 ? formatNumber(-openingBalance) : ''}
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(openingBalance)}</TableCell>
                    </TableRow>
                  )}
                  {transactions.map((transaction, index) => {
                    const runningBalance = accountBalance(transactions.slice(0, index + 1), account)
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
                        <TableCell>{transaction.ver}</TableCell>
                        <TableCell className="text-right">{formatNumber(transaction.debit)}</TableCell>
                        <TableCell className="text-right">{formatNumber(transaction.credit)}</TableCell>
                        <TableCell className="text-right">{formatNumber(runningBalance)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="mt-4 text-right font-bold">
                Total Balance: {formatNumber(accountBalance(transactions, account))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default Ledger