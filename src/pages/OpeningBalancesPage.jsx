import React, { useState, useMemo } from 'react'
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
import { formatNumber } from '../utils/formatUtils'

const OpeningBalancesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: openingBalances, isLoading: balancesLoading, error: balancesError } = useOpeningBalances(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  const addOpeningBalanceMutation = useAddOpeningBalance()
  const deleteOpeningBalanceMutation = useDeleteOpeningBalance()
  const [newBalance, setNewBalance] = useState({ account: '', debit: 0, credit: 0 })

  const groupedBalances = useMemo(() => {
    if (!openingBalances) return []
    return openingBalances.map(balance => ({
      ...balance,
      debit: balance.balance > 0 ? balance.balance : 0,
      credit: balance.balance < 0 ? -balance.balance : 0
    }))
  }, [openingBalances])

  const totals = useMemo(() => {
    return groupedBalances.reduce((acc, balance) => {
      acc.debit += balance.debit
      acc.credit += balance.credit
      return acc
    }, { debit: 0, credit: 0 })
  }, [groupedBalances])

  const handleAddBalance = () => {
    if (!newBalance.account || (newBalance.debit === 0 && newBalance.credit === 0)) {
      toast.error('Please select an account and enter a debit or credit amount')
      return
    }
    const balance = newBalance.debit - newBalance.credit
    addOpeningBalanceMutation.mutate({ account: newBalance.account, balance, user_id: session.user.id })
    setNewBalance({ account: '', debit: 0, credit: 0 })
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
          return (
            <TableRow key={balance.id}>
              <TableCell>{balance.account}</TableCell>
              <TableCell>{account ? account.account_name : 'Unknown'}</TableCell>
              <TableCell>{formatNumber(balance.debit)}</TableCell>
              <TableCell>{formatNumber(balance.credit)}</TableCell>
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
        <TableRow className="font-bold">
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell>{formatNumber(totals.debit)}</TableCell>
          <TableCell>{formatNumber(totals.credit)}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )

  if (balancesLoading || accountsLoading) return <div>Loading opening balances and accounts...</div>
  if (balancesError) return <div>Error loading opening balances: {balancesError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>

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
          placeholder="Debit"
          value={newBalance.debit}
          onChange={(e) => setNewBalance({ ...newBalance, debit: parseFloat(e.target.value) || 0 })}
        />
        <Input
          type="number"
          placeholder="Credit"
          value={newBalance.credit}
          onChange={(e) => setNewBalance({ ...newBalance, credit: parseFloat(e.target.value) || 0 })}
        />
        <Button onClick={handleAddBalance}>Add Balance</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Opening Balances</CardTitle>
        </CardHeader>
        <CardContent>
          {renderBalanceTable(groupedBalances)}
        </CardContent>
      </Card>
    </div>
  )
}

export default OpeningBalancesPage
