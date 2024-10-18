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

  if (isLoading) return <div>Loading opening balances...</div>
  if (error) return <div>Error loading opening balances: {error.message}</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto p-4">
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
                placeholder="Balance"
                value={newBalance.balance}
                onChange={(e) => setNewBalance({ ...newBalance, balance: parseFloat(e.target.value) })}
                required
              />
              <Button type="submit">Add Balance</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opening Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openingBalances?.map((balance) => (
                  <TableRow key={balance.id}>
                    <TableCell>{balance.account}</TableCell>
                    <TableCell>{balance.balance}</TableCell>
                    <TableCell>
                      <Button variant="destructive" onClick={() => handleDeleteBalance(balance.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OpeningBalancesPage