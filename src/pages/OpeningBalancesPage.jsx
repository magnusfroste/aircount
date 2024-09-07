import React, { useState } from 'react'
import { useOpeningBalances, useAddOpeningBalance, useImportOpeningBalances } from '../integrations/supabase/hooks/openingBalances'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'

const OpeningBalancesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: openingBalances, isLoading, error } = useOpeningBalances(session?.user?.id)
  const addOpeningBalanceMutation = useAddOpeningBalance()
  const importOpeningBalancesMutation = useImportOpeningBalances()
  const [newBalance, setNewBalance] = useState({ account: '', balance: 0 })

  const handleAddBalance = () => {
    addOpeningBalanceMutation.mutate({ ...newBalance, user_id: session.user.id })
    setNewBalance({ account: '', balance: 0 })
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const content = e.target.result
        const balances = parseOpeningBalances(content)
        try {
          await importOpeningBalancesMutation.mutateAsync({ balances, userId: session.user.id })
          toast.success('Opening balances imported successfully')
        } catch (error) {
          toast.error(`Error importing opening balances: ${error.message}`)
        }
      }
      reader.readAsText(file)
    }
  }

  const parseOpeningBalances = (content) => {
    const lines = content.split('\n')
    return lines
      .filter(line => line.startsWith('#IB'))
      .map(line => {
        const [, , account, balance] = line.split(' ')
        return { account, balance: parseFloat(balance) }
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
        <Input
          type="file"
          accept=".se"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Button onClick={() => document.getElementById('file-upload').click()}>
          Import .se File
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {openingBalances.map((balance) => (
            <TableRow key={balance.id}>
              <TableCell>{balance.account}</TableCell>
              <TableCell>{balance.balance.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OpeningBalancesPage