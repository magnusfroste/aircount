import React, { useState, useMemo } from 'react'
import { useTransactions, useAddTransaction, useDeleteTransaction, useDeleteAllTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, Trash2 } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'

const TransactionForm = ({ newTransaction, setNewTransaction, accounts, handleAddTransaction }) => (
  <div className="mb-4 flex space-x-2">
    <Input
      type="text"
      placeholder="Nr"
      value={newTransaction.ver}
      onChange={(e) => setNewTransaction({ ...newTransaction, ver: e.target.value })}
    />
    <Input
      type="date"
      value={newTransaction.date}
      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
    />
    <Select
      value={newTransaction.account}
      onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
    >
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.account}>
            {account.account} - {account.account_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Input
      type="number"
      placeholder="Debit"
      value={newTransaction.debit}
      onChange={(e) => setNewTransaction({ ...newTransaction, debit: parseFloat(e.target.value) })}
    />
    <Input
      type="number"
      placeholder="Credit"
      value={newTransaction.credit}
      onChange={(e) => setNewTransaction({ ...newTransaction, credit: parseFloat(e.target.value) })}
    />
    <Button onClick={handleAddTransaction}>
      <PlusIcon className="mr-2 h-4 w-4" /> Add
    </Button>
  </div>
)

const TransactionRow = ({ transaction, handleDeleteTransaction, accountName }) => (
  <TableRow key={transaction.id}>
    <TableCell>{format(parseISO(transaction.date), 'yyyy-MM-dd')}</TableCell>
    <TableCell>{accountName}</TableCell>
    <TableCell>{transaction.debit}</TableCell>
    <TableCell>{transaction.credit}</TableCell>
    <TableCell>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDeleteTransaction(transaction.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
)

const Transactions = () => {
  const [newTransaction, setNewTransaction] = useState({ ver: '', date: '', account: '', debit: 0, credit: 0 })
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session.user.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session.user.id)
  const addTransactionMutation = useAddTransaction()
  const deleteTransactionMutation = useDeleteTransaction()
  const deleteAllTransactionsMutation = useDeleteAllTransactions()

  const accountMap = useMemo(() => {
    if (!accounts) return {}
    return accounts.reduce((acc, account) => {
      acc[account.account] = account.account_name
      return acc
    }, {})
  }, [accounts])

  const groupedTransactions = useMemo(() => {
    if (!transactions) return {}
    const groups = transactions.reduce((acc, transaction) => {
      const ver = transaction.ver || 'Unspecified'
      if (!acc[ver]) {
        acc[ver] = []
      }
      acc[ver].push(transaction)
      return acc
    }, {})

    // Sort transactions within each group by date (latest first)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    return groups
  }, [transactions])

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => {
      // Convert to numbers for numerical sorting, use 'Infinity' for 'Unspecified'
      const numA = a === 'Unspecified' ? Infinity : Number(a)
      const numB = b === 'Unspecified' ? Infinity : Number(b)
      return numA - numB
    })
  }, [groupedTransactions])

  if (transactionsLoading || accountsLoading) return <div>Loading...</div>
  if (transactionsError) return <div>Error loading transactions: {transactionsError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <TransactionForm
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        accounts={accounts}
        handleAddTransaction={handleAddTransaction}
      />
      <Button onClick={handleDeleteAllTransactions} variant="destructive" className="mb-4">
        <Trash2 className="mr-2 h-4 w-4" /> Delete All
      </Button>
      <div className="space-y-6">
        {sortedGroupKeys.map((ver) => (
          <Card key={ver}>
            <CardHeader>
              <CardTitle>Transaction Number: {ver}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedTransactions[ver].map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      handleDeleteTransaction={handleDeleteTransaction}
                      accountName={accountMap[transaction.account] || 'Unknown Account'}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Transactions
