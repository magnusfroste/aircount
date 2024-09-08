import React, { useState } from 'react'
import { useOpeningBalances, useAddOpeningBalance, useDeleteOpeningBalance } from '../integrations/supabase/hooks/openingBalances'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

const OpeningBalancesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: openingBalances, isLoading, error } = useOpeningBalances(session?.user?.id)
  const addOpeningBalanceMutation = useAddOpeningBalance()
  const deleteOpeningBalanceMutation = useDeleteOpeningBalance()
  const [newBalance, setNewBalance] = useState({ account: '', balance: 0 })

  const handleAddBalance = () => {
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

  if (isLoading) return <div>Loading opening balances...</div>
  if (error) return <div>Error loading opening balances: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Opening Balances</h1>
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Account"
          value={newBalance.account}
          onChange={(e) => setNewBalance({ ...newBalance, account: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Balance"
          value={newBalance.balance}
          onChange={(e) => setNewBalance({ ...newBalance, balance: parseFloat(e.target.value) })}
        />
        <Button onClick={handleAddBalance}>Add Balance</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {openingBalances.map((balance) => (
            <TableRow key={balance.id}>
              <TableCell>{balance.account}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OpeningBalancesPage