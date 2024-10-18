import React, { useState } from 'react'
import Header from '../components/Header'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from 'sonner'
import { useOpeningBalances, useAddOpeningBalance, useDeleteOpeningBalance } from '../integrations/supabase/hooks/openingBalances'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { formatNumber } from '../utils/numberFormatting'

const OpeningBalancesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: openingBalances, isLoading, error } = useOpeningBalances(session?.user?.id)
  const { data: accounts } = useAccounts(session?.user?.id)
  const addOpeningBalanceMutation = useAddOpeningBalance()
  const deleteOpeningBalanceMutation = useDeleteOpeningBalance()
  const [newBalance, setNewBalance] = useState({ account: '', balance: 0 })

  const handleAddBalance = async (e) => {
    e.preventDefault()
    try {
      await addOpeningBalanceMutation.mutateAsync({
        ...newBalance,
        user_id: session.user.id
      })
      toast.success('Balance added successfully')
      setNewBalance({ account: '', balance: 0 })
    } catch (error) {
      toast.error(`Error adding balance: ${error.message}`)
    }
  }

  const handleDeleteBalance = async (id) => {
    try {
      await deleteOpeningBalanceMutation.mutateAsync({ id, user_id: session.user.id })
      toast.success('Balance deleted successfully')
    } catch (error) {
      toast.error(`Error deleting balance: ${error.message}`)
    }
  }

  const getAccountName = (accountNumber) => {
    const account = accounts?.find(acc => acc.account === accountNumber)
    return account ? account.account_name : 'Unknown Account'
  }

  const groupedBalances = openingBalances?.reduce((acc, balance) => {
    if (balance.balance >= 0) {
      acc.positive.push(balance)
    } else {
      acc.negative.push(balance)
    }
    return acc
  }, { positive: [], negative: [] })

  const sumPositive = groupedBalances?.positive.reduce((sum, balance) => sum + balance.balance, 0) || 0
  const sumNegative = groupedBalances?.negative.reduce((sum, balance) => sum + Math.abs(balance.balance), 0) || 0

  if (isLoading) return <div>Loading opening balances...</div>
  if (error) return <div>Error loading opening balances: {error.message}</div>

  const renderBalanceTable = (balances, title) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Number</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.map((balance) => (
              <TableRow key={balance.id}>
                <TableCell>{balance.account}</TableCell>
                <TableCell>{getAccountName(balance.account)}</TableCell>
                <TableCell>{balance.balance >= 0 ? formatNumber(balance.balance) : '0.00'}</TableCell>
                <TableCell>{balance.balance < 0 ? formatNumber(Math.abs(balance.balance)) : '0.00'}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteBalance(balance.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>{formatNumber(sumPositive)}</TableCell>
              <TableCell>{formatNumber(sumNegative)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto p-4">
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Opening Balances</h1>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Opening Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBalance} className="space-y-4">
                <select
                  className="w-full p-2 border rounded"
                  value={newBalance.account}
                  onChange={(e) => setNewBalance({ ...newBalance, account: e.target.value })}
                  required
                >
                  <option value="">Select Account</option>
                  {accounts?.map((account) => (
                    <option key={account.id} value={account.account}>
                      {account.account} - {account.account_name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Balance (use negative for credit)"
                  value={newBalance.balance}
                  onChange={(e) => setNewBalance({ ...newBalance, balance: parseFloat(e.target.value) })}
                  required
                />
                <Button type="submit">Add Balance</Button>
              </form>
            </CardContent>
          </Card>

          {renderBalanceTable(groupedBalances?.positive || [], 'Positive Balances (Debit)')}
          {renderBalanceTable(groupedBalances?.negative || [], 'Negative Balances (Credit)')}
        </div>
      </div>
    </div>
  )
}

export default OpeningBalancesPage