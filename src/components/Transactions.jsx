import React, { useState, useMemo } from 'react'
import { useTransactions, useAddTransaction, useDeleteTransaction, useDeleteAllTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ArrowUpDown } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { toast } from 'sonner'
import TransactionForm from './TransactionForm'
import TransactionRow from './TransactionRow'
import { formatNumber } from '../utils/numberFormatting'

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

  const groupedAndSortedTransactions = useMemo(() => {
    if (!transactions) return []
    const grouped = transactions.reduce((acc, transaction) => {
      const ver = transaction.ver || 'Unspecified'
      if (!acc[ver]) {
        acc[ver] = []
      }
      acc[ver].push(transaction)
      return acc
    }, {})
    
    return Object.entries(grouped)
      .sort(([verA], [verB]) => {
        if (verA === 'Unspecified') return 1
        if (verB === 'Unspecified') return -1
        const numA = parseInt(verA, 10)
        const numB = parseInt(verB, 10)
        return sortOrder === 'desc' ? numB - numA : numA - numB
      })
  }, [transactions, sortOrder])

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
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Transactions</h1>
    <TransactionForm
      newTransaction={newTransaction}
      setNewTransaction={setNewTransaction}
      accounts={accounts}
      handleAddTransaction={handleAddTransaction}
    />
    <div className="flex justify-between items-center mb-4">
      <Button onClick={handleDeleteAllTransactions} variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" /> Delete All
      </Button>
      <Button onClick={toggleSortOrder} variant="outline">
        Sort {sortOrder === 'desc' ? 'Ascending' : 'Descending'}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
    <div className="space-y-6">
      {groupedAndSortedTransactions.map(([ver, verTransactions]) => (
        <Card key={ver}>
          <CardHeader>
            <CardTitle>Transaction Number: {ver}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={{
                      ...transaction,
                      debit: formatNumber(transaction.debit),
                      credit: formatNumber(transaction.credit)
                    }}
                    handleDeleteTransaction={handleDeleteTransaction}
                    accountNumber={transaction.account}
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
