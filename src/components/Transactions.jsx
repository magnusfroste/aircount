import React, { useState } from 'react'
import { useTransactions, useAddTransaction, useUpdateTransaction, useDeleteTransaction } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { format } from 'date-fns'

const Transactions = () => {
  const [newTransaction, setNewTransaction] = useState({ date: '', account: '', debit: 0, credit: 0 })
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session.user.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session.user.id)
  const addTransactionMutation = useAddTransaction()
  const updateTransactionMutation = useUpdateTransaction()
  const deleteTransactionMutation = useDeleteTransaction()

  const handleAddTransaction = () => {
    addTransactionMutation.mutate({ ...newTransaction, user_id: session.user.id })
    setNewTransaction({ date: '', account: '', debit: 0, credit: 0 })
  }

  const handleUpdateTransaction = (id, updateData) => {
    updateTransactionMutation.mutate({ id, user_id: session.user.id, ...updateData })
  }

  const handleDeleteTransaction = (id) => {
    deleteTransactionMutation.mutate({ id, user_id: session.user.id })
  }

  if (transactionsLoading || accountsLoading) return <div>Loading...</div>
  if (transactionsError) return <div>Error loading transactions: {transactionsError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="mb-4 flex space-x-2">
        <Input
          type="date"
          value={newTransaction.date}
          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
        />
        <Select
          value={newTransaction.account}
          onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.account_name}>
                {account.account_name}
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
          <PlusIcon className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
              <TableCell>{transaction.account}</TableCell>
              <TableCell>{transaction.debit}</TableCell>
              <TableCell>{transaction.credit}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    const updatedTransaction = {
                      date: prompt('Enter new date', transaction.date),
                      account: prompt('Enter new account', transaction.account),
                      debit: parseFloat(prompt('Enter new debit', transaction.debit)),
                      credit: parseFloat(prompt('Enter new credit', transaction.credit))
                    }
                    handleUpdateTransaction(transaction.id, updatedTransaction)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteTransaction(transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Transactions