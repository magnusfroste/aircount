import React, { useState, useMemo } from 'react'
import { useTransactions, useAddTransaction, useDeleteTransaction, useDeleteAllTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Trash2 } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { toast } from 'sonner'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Transactions = () => {
  const [newTransaction, setNewTransaction] = useState({ ver: '', date: '', account: '', debit: 0, credit: 0 })
  const [sortOrder, setSortOrder] = useState('desc')
  const { session } = useSupabaseAuth()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session.user.id, sortOrder)
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
    return transactions.reduce((acc, transaction) => {
      if (!acc[transaction.ver]) {
        acc[transaction.ver] = []
      }
      acc[transaction.ver].push(transaction)
      return acc
    }, {})
  }, [transactions])

  const handleAddTransaction = () => {
    addTransactionMutation.mutate({ ...newTransaction, user_id: session.user.id })
    setNewTransaction({ ver: '', date: '', account: '', debit: 0, credit: 0 })
  }

  const handleDeleteTransaction = (id) => {
    deleteTransactionMutation.mutate({ id, user_id: session.user.id })
  }

  const handleDeleteAllTransactions = () => {
    if (window.confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
      deleteAllTransactionsMutation.mutate(session.user.id, {
        onSuccess: () => {
          toast.success('All transactions have been deleted')
        },
        onError: (error) => {
          toast.error(`Error deleting transactions: ${error.message}`)
        }
      })
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc')
  }

  if (transactionsLoading || accountsLoading) return <div>Loading...</div>
  if (transactionsError) return <div>Error loading transactions: {transactionsError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>

  return (
    <div>
      <TransactionForm
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        accounts={accounts}
        handleAddTransaction={handleAddTransaction}
      />
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transaction List</h2>
        <div className="flex space-x-2">
          <Button onClick={toggleSortOrder} variant="outline">
            Sort {sortOrder === 'desc' ? 'Ascending' : 'Descending'}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={handleDeleteAllTransactions} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete All
          </Button>
        </div>
      </div>
      {Object.entries(groupedTransactions).map(([ver, transactions]) => (
        <Card key={ver} className="mb-6">
          <CardHeader>
            <CardTitle>Transaction Number: {ver}</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList
              transactions={transactions}
              handleDeleteTransaction={handleDeleteTransaction}
              accountMap={accountMap}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Transactions