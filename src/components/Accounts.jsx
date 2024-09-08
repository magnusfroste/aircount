import React, { useState, useRef } from 'react'
import { useAccounts, useAddAccount, useUpdateAccount, useDeleteAccount, useImportAccounts, useDeleteAllAccounts } from '../integrations/supabase/hooks/accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, Pencil, Trash2, Upload } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { toast } from 'sonner'
import AccountForm from './AccountForm'
import AccountTable from './AccountTable'
import ImportButtons from './ImportButtons'

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
  const jsonFileInputRef = useRef(null)

  const handleAddAccount = () => {
    if (!newAccount.account || !newAccount.account_name) {
      toast.error('Account number and name are required')
      return
    }
    addAccountMutation.mutate({ ...newAccount, user_id: session.user.id })
    setNewAccount({ account: '', account_name: '' })
  }

  const handleUpdateAccount = (id, updateData) => {
    if (!updateData.account || !updateData.account_name) {
      toast.error('Account number and name are required')
      return
    }
    updateAccountMutation.mutate({ id, user_id: session.user.id, ...updateData })
  }

  const handleDeleteAccount = (id) => {
    deleteAccountMutation.mutate({ id, user_id: session.user.id })
  }

  const handleImportAccounts = async (event, isJson = false) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const content = await file.text()
        let importedAccounts
        if (isJson) {
          importedAccounts = JSON.parse(content)
          if (!Array.isArray(importedAccounts)) {
            throw new Error('Invalid JSON format. Expected an array of accounts.')
          }
        } else {
          importedAccounts = parseSEFile(content).accounts
        }
        const validAccounts = importedAccounts.filter(acc => acc.account && acc.account_name)
        
        if (validAccounts.length === 0) {
          throw new Error('No valid accounts found in the file. Each account must have both an account number and a name.')
        }

        await importAccountsMutation.mutateAsync({ accounts: validAccounts, userId: session.user.id })
        toast.success(`Successfully imported ${validAccounts.length} accounts`)
        
        if (validAccounts.length !== importedAccounts.length) {
          toast.warning(`${importedAccounts.length - validAccounts.length} accounts were skipped due to missing account number or name`)
        }
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
      <AccountForm
        newAccount={newAccount}
        setNewAccount={setNewAccount}
        handleAddAccount={handleAddAccount}
      />
      <ImportButtons
        handleImportClick={() => fileInputRef.current.click()}
        handleJsonImportClick={() => jsonFileInputRef.current.click()}
        handleDeleteAllAccounts={handleDeleteAllAccounts}
      />
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".se"
        onChange={(e) => handleImportAccounts(e)}
      />
      <Input
        type="file"
        ref={jsonFileInputRef}
        className="hidden"
        accept=".json"
        onChange={(e) => handleImportAccounts(e, true)}
      />
      <AccountTable
        accounts={accounts}
        handleUpdateAccount={handleUpdateAccount}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}

export default Accounts