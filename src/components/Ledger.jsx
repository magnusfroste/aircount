import React, { useState } from 'react'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useOpeningBalances } from '../integrations/supabase/hooks/openingBalances'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from 'date-fns'

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

  const getOpeningBalance = (account) => {
    const openingBalance = openingBalances.find(balance => balance.account === account)
    return openingBalance ? openingBalance.balance : 0
  }

  const accountBalance = (accountTransactions, account) => {
    const openingBalance = getOpeningBalance(account)
    return accountTransactions.reduce((balance, transaction) => {
      return balance + transaction.debit - transaction.credit
    }, openingBalance)
  }

  const filteredLedgerData = selectedAccount ? { [selectedAccount]: ledgerData[selectedAccount] } : ledgerData

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
      {Object.entries(filteredLedgerData).map(([account, transactions]) => (
        <Card key={account} className="mb-6">
          <CardHeader>
            <CardTitle>{account} - {accounts.find(a => a.account === account)?.account_name}</CardTitle>
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
                {getOpeningBalance(account) !== 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>Opening Balance</TableCell>
                    <TableCell className="text-right">{getOpeningBalance(account).toFixed(2)}</TableCell>
                  </TableRow>
                )}
                {transactions.map((transaction, index) => {
                  const runningBalance = accountBalance(transactions.slice(0, index + 1), account)
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
                      <TableCell>{transaction.ver}</TableCell>
                      <TableCell className="text-right">{transaction.debit.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{transaction.credit.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{runningBalance.toFixed(2)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <div className="mt-4 text-right font-bold">
              Total Balance: {accountBalance(transactions, account).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Ledger