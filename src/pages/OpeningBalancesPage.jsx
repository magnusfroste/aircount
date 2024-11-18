import React, { useState } from 'react'
import { useOpeningBalances, useAddOpeningBalance, useUpdateOpeningBalance, useDeleteOpeningBalance } from '../integrations/supabase/hooks/openingBalances'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import OpeningBalanceForm from '../components/OpeningBalanceForm'
import OpeningBalanceTable from '../components/OpeningBalanceTable'

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
  const [sortOrder, setSortOrder] = useState('debit-asc')

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
      <OpeningBalanceForm
        accounts={accounts}
        newBalance={newBalance}
        setNewBalance={setNewBalance}
        handleAddBalance={handleAddBalance}
      />
      <Card>
        <CardHeader>
          <CardTitle>Opening Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <OpeningBalanceTable
            accounts={accounts}
            groupedBalances={groupedBalances}
            editingId={editingId}
            editValues={editValues}
            setEditValues={setEditValues}
            handleStartEdit={handleStartEdit}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleDeleteBalance={handleDeleteBalance}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            totals={totals}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default OpeningBalancesPage