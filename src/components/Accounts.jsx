import React, { useState, useRef } from 'react'
import { useAccounts, useAddAccount, useUpdateAccount, useDeleteAccount, useImportAccounts, useDeleteAllAccounts } from '../integrations/supabase/hooks/accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, Pencil, Trash2, Upload } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { toast } from 'sonner'

const Accounts = () => {
  const [newAccount, setNewAccount] = useState({ account: '', account_name: '' })
  const { session } = useSupabaseAuth()
  const { data: accounts, isLoading, error } = useAccounts(session.user.id)
  const addAccountMutation = useAddAccount()
  const updateAccountMutation = useUpdateAccount()
  const deleteAccountMutation = useDeleteAccount()
  const importAccountsMutation = useImportAccounts()
  const deleteAllAccountsMutation = useDeleteAllAccounts()
  const fileInputRef = useRef(null)

  const handleAddAccount = () => {
    addAccountMutation.mutate({ ...newAccount, user_id: session.user.id })
    setNewAccount({ account: '', account_name: '' })
  }

  const handleUpdateAccount = (id, updateData) => {
    updateAccountMutation.mutate({ id, user_id: session.user.id, ...updateData })
  }

  const handleDeleteAccount = (id) => {
    deleteAccountMutation.mutate({ id, user_id: session.user.id })
  }

  const handleImportClick = () => {
    fileInputRef.current.click()
  }

  const handleImportAccounts = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const content = await file.text()
        const importedAccounts = JSON.parse(content)
        await importAccountsMutation.mutateAsync({ accounts: importedAccounts, userId: session.user.id })
        toast.success(`Successfully imported ${importedAccounts.length} accounts`)
      } catch (error) {
        console.error('Error importing accounts:', error)
        toast.error(`Error importing accounts: ${error.message}`)
      }
      event.target.value = '' // Reset the file input
    }
  }

  const handleDeleteAllAccounts = () => {
    if (window.confirm('Are you sure you want to delete all accounts? This action cannot be undone.')) {
      deleteAllAccountsMutation.mutate(session.user.id, {
        onSuccess: () => {
          toast.success('All accounts have been deleted')
        },
        onError: (error) => {
          toast.error(`Error deleting accounts: ${error.message}`)
        }
      })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex-grow flex space-x-2">
          <Input
            placeholder="Account"
            value={newAccount.account}
            onChange={(e) => setNewAccount({ ...newAccount, account: e.target.value })}
          />
          <Input
            placeholder="Account Name"
            value={newAccount.account_name}
            onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
          />
          <Button onClick={handleAddAccount}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Account
          </Button>
          <Button onClick={handleImportClick} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Import JSON
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleImportAccounts}
          />
        </div>
        <Button onClick={handleDeleteAllAccounts} variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete All Accounts
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.account}</TableCell>
              <TableCell>{account.account_name}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    const updatedAccount = {
                      account: prompt('Enter new account', account.account),
                      account_name: prompt('Enter new account name', account.account_name)
                    }
                    if (updatedAccount.account && updatedAccount.account_name) {
                      handleUpdateAccount(account.id, updatedAccount)
                    }
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteAccount(account.id)}
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

export default Accounts