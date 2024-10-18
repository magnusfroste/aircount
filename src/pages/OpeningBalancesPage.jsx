import React, { useState } from 'react'
import { useOpeningBalances, useAddOpeningBalance, useDeleteOpeningBalance } from '../integrations/supabase/hooks/openingBalances'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

const OpeningBalancesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: openingBalances, isLoading: balancesLoading, error: balancesError } = useOpeningBalances(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  const addOpeningBalanceMutation = useAddOpeningBalance()
  const deleteOpeningBalanceMutation = useDeleteOpeningBalance()
  const [newBalance, setNewBalance] = useState({ account: '', balance: 0 })

  const handleAddBalance = () => {
    if (!newBalance.account || !newBalance.balance) {
      toast.error('Please select an account and enter a balance')
      return
    }
    addOpeningBalanceMutation.mutate({ ...newBalance, user_id: session.user.id })
    setNewBalance({ account: '', balance: 0 })
  }

  const handleDeleteBalance = (id) => {
    deleteOpeningBalanceMutation.mutate({ id, user_id: session.user.id }, {
      onSuccess: () => {
        toast.success('Opening balance deleted successfully')
      },
      onError: (error) => {
        toast.error(`Error deleting opening balance: ${error.message}`)
      }
    })
  }

  if (balancesLoading || accountsLoading) return <div>Loading opening balances and accounts...</div>
  if (balancesError) return <div>Error loading opening balances: {balancesError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>

  // Group opening balances by account type
  const groupedBalances = openingBalances.reduce((acc, balance) => {
    const account = accounts.find(a => a.account === balance.account)
    const accountType = account ? account.account_type : 'Other'
    if (!acc[accountType]) {
      acc[accountType] = []
    }
    acc[accountType].push(balance)
    return acc
  }, {})

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Opening Balances</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Opening Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Select
              value={newBalance.account}
              onValueChange={(value) => setNewBalance({ ...newBalance, account: value })}
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
              placeholder="Balance"
              value={newBalance.balance}
              onChange={(e) => setNewBalance({ ...newBalance, balance: parseFloat(e.target.value) })}
            />
            <Button onClick={handleAddBalance}>Add Balance</Button>
          </div>
        </CardContent>
      </Card>
      
      {Object.entries(groupedBalances).map(([accountType, balances]) => (
        <Card key={accountType} className="mb-4">
          <CardHeader>
            <CardTitle>{accountType}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balances.map((balance) => {
                  const account = accounts.find(a => a.account === balance.account)
                  return (
                    <TableRow key={balance.id}>
                      <TableCell>{balance.account}</TableCell>
                      <TableCell>{account ? account.account_name : 'Unknown'}</TableCell>
                      <TableCell>{balance.balance.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBalance(balance.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default OpeningBalancesPage