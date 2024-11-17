import React, { useState } from 'react'
import { useOpeningBalances, useAddOpeningBalance, useUpdateOpeningBalance, useDeleteOpeningBalance } from '../integrations/supabase/hooks/openingBalances'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react'
import { formatNumber } from '../utils/formatUtils'

const OpeningBalancesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: openingBalances, isLoading: balancesLoading, error: balancesError } = useOpeningBalances(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  const addOpeningBalanceMutation = useAddOpeningBalance()
  const updateOpeningBalanceMutation = useUpdateOpeningBalance()
  const deleteOpeningBalanceMutation = useDeleteOpeningBalance()
  const [newBalance, setNewBalance] = useState({ account: '', debit: 0, credit: 0 })
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({ debit: 0, credit: 0 })

  const handleAddBalance = () => {
    if (!newBalance.account) {
      toast.error('Please select an account')
      return
    }
    
    const balance = newBalance.debit - newBalance.credit
    addOpeningBalanceMutation.mutate(
      { account: newBalance.account, balance, user_id: session.user.id },
      {
        onSuccess: () => {
          toast.success('Opening balance added successfully')
          setNewBalance({ account: '', debit: 0, credit: 0 })
        },
        onError: (error) => {
          toast.error(`Error adding opening balance: ${error.message}`)
        }
      }
    )
  }

  const handleStartEdit = (balance) => {
    setEditingId(balance.id)
    setEditValues({
      debit: balance.balance > 0 ? balance.balance : 0,
      credit: balance.balance < 0 ? -balance.balance : 0
    })
  }

  const handleSaveEdit = (id) => {
    const balance = editValues.debit - editValues.credit
    updateOpeningBalanceMutation.mutate(
      { id, balance, user_id: session.user.id },
      {
        onSuccess: () => {
          toast.success('Opening balance updated successfully')
          setEditingId(null)
          setEditValues({ debit: 0, credit: 0 })
        },
        onError: (error) => {
          toast.error(`Error updating opening balance: ${error.message}`)
        }
      }
    )
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValues({ debit: 0, credit: 0 })
  }

  const handleDeleteBalance = (id) => {
    deleteOpeningBalanceMutation.mutate(
      { id, user_id: session.user.id },
      {
        onSuccess: () => {
          toast.success('Opening balance deleted successfully')
        },
        onError: (error) => {
          toast.error(`Error deleting opening balance: ${error.message}`)
        }
      }
    )
  }

  const groupedBalances = React.useMemo(() => {
    if (!openingBalances) return []
    return openingBalances.map(balance => ({
      ...balance,
      debit: balance.balance > 0 ? balance.balance : 0,
      credit: balance.balance < 0 ? -balance.balance : 0
    }))
  }, [openingBalances])

  const totals = React.useMemo(() => {
    return groupedBalances.reduce((acc, balance) => {
      acc.debit += balance.debit
      acc.credit += balance.credit
      return acc
    }, { debit: 0, credit: 0 })
  }, [groupedBalances])

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
            {accounts?.map((account) => (
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
          className="w-32"
        />
        <Input
          type="number"
          placeholder="Credit"
          value={newBalance.credit}
          onChange={(e) => setNewBalance({ ...newBalance, credit: parseFloat(e.target.value) || 0 })}
          className="w-32"
        />
        <Button onClick={handleAddBalance}>
          <Plus className="h-4 w-4 mr-2" />
          Add Balance
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Opening Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedBalances.map((balance) => {
                const account = accounts?.find(a => a.account === balance.account)
                return (
                  <TableRow key={balance.id}>
                    <TableCell>{balance.account}</TableCell>
                    <TableCell>{account ? account.account_name : 'Unknown'}</TableCell>
                    <TableCell className="text-right">
                      {editingId === balance.id ? (
                        <Input
                          type="number"
                          value={editValues.debit}
                          onChange={(e) => setEditValues({ ...editValues, debit: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-right"
                        />
                      ) : (
                        formatNumber(balance.debit)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === balance.id ? (
                        <Input
                          type="number"
                          value={editValues.credit}
                          onChange={(e) => setEditValues({ ...editValues, credit: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-right"
                        />
                      ) : (
                        formatNumber(balance.credit)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === balance.id ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveEdit(balance.id)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartEdit(balance)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBalance(balance.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="font-bold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">{formatNumber(totals.debit)}</TableCell>
                <TableCell className="text-right">{formatNumber(totals.credit)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default OpeningBalancesPage