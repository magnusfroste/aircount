import React, { useState } from 'react'
import { useAccounts, useAddAccount, useUpdateAccount, useDeleteAccount } from '../integrations/supabase/hooks/accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { toast } from 'sonner'

const AccountForm = ({ newAccount, setNewAccount, handleAddAccount }) => (
  <div className="mb-4 flex space-x-2">
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
  </div>
)

const AccountRow = ({ account, handleUpdateAccount, handleDeleteAccount }) => (
  <TableRow key={account.id}>
    <TableCell>{account.account}</TableCell>
    <TableCell>{account.account_name}</TableCell>
    <TableCell>
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
        onClick={() => handleUpdateAccount(account.id)}
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
)

const Accounts = () => {
  const [newAccount, setNewAccount] = useState({ account: '', account_name: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 50
  const { session } = useSupabaseAuth()
  const { data: accountsData, isLoading, error } = useAccounts(session.user.id, currentPage, pageSize)
  const addAccountMutation = useAddAccount()
  const updateAccountMutation = useUpdateAccount()
  const deleteAccountMutation = useDeleteAccount()

  const handleAddAccount = () => {
    if (!newAccount.account || !newAccount.account_name) {
      toast.error('Please fill in both account and account name')
      return
    }
    addAccountMutation.mutate(
      { ...newAccount, user_id: session.user.id },
      {
        onSuccess: () => {
          toast.success('Account added successfully')
          setNewAccount({ account: '', account_name: '' })
        },
        onError: (error) => {
          toast.error(`Error adding account: ${error.message}`)
        }
      }
    )
  }

  const handleUpdateAccount = (id) => {
    const account = accountsData.data.find(a => a.id === id)
    const updatedAccount = {
      account: prompt('Enter new account', account.account),
      account_name: prompt('Enter new account name', account.account_name)
    }
    if (updatedAccount.account && updatedAccount.account_name) {
      updateAccountMutation.mutate({ id, user_id: session.user.id, ...updatedAccount })
    }
  }

  const handleDeleteAccount = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteAccountMutation.mutate({ id, user_id: session.user.id })
    }
  }

  const totalPages = accountsData ? Math.ceil(accountsData.count / pageSize) : 0

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountsData.data.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              handleUpdateAccount={handleUpdateAccount}
              handleDeleteAccount={handleDeleteAccount}
            />
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, accountsData.count)} of {accountsData.count} accounts
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Accounts