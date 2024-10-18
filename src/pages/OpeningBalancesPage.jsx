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

  const positiveBalances = openingBalances.filter(balance => balance.balance >= 0)
  const negativeBalances = openingBalances.filter(balance => balance.balance < 0)

  const renderBalanceTable = (balances) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {balances.map((balance) => {
          const account = accounts.find(a => a.account === balance.account)
          const debit = balance.balance >= 0 ? balance.balance : 0
          const credit = balance.balance < 0 ? Math.abs(balance.balance) : 0
          return (
            <TableRow key={balance.id}>
              <TableCell>{balance.account}</TableCell>
              <TableCell>{account ? account.account_name : 'Unknown'}</TableCell>
              <TableCell>{debit.toFixed(2)}</TableCell>
              <TableCell>{credit.toFixed(2)}</TableCell>
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
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Opening Balances</h1>
      <div className="mb-4 flex space-x-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Positive Balances (Debit)</CardTitle>
          </CardHeader>
          <CardContent>
            {renderBalanceTable(positiveBalances)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Negative Balances (Credit)</CardTitle>
          </CardHeader>
          <CardContent>
            {renderBalanceTable(negativeBalances)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OpeningBalancesPage