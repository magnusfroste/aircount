import React, { useState } from 'react'
import { useAccounts, useAddAccount, useUpdateAccount, useDeleteAccount } from '../integrations/supabase/hooks/accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const AccountForm = ({ newAccount, setNewAccount, handleAddAccount }) => (
  <form onSubmit={(e) => { e.preventDefault(); handleAddAccount(); }} className="space-y-4">
    <Input
      placeholder="Account"
      value={newAccount.account}
      onChange={(e) => setNewAccount({ ...newAccount, account: e.target.value })}
      required
    />
    <Input
      placeholder="Account Name"
      value={newAccount.account_name}
      onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
      required
    />
    <Button type="submit">
      <PlusIcon className="mr-2 h-4 w-4" /> Add Account
    </Button>
  </form>
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
  const [searchTerm, setSearchTerm] = useState('')
  const { session } = useSupabaseAuth()
  const { data: accounts, isLoading, error } = useAccounts(session?.user?.id)
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
    const account = accounts.find(a => a.id === id)
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

  const filteredAccounts = accounts?.filter(account =>
    account.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.account_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) return <div>Loading accounts...</div>
  if (error) return <div>Error loading accounts: {error.message}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Account</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm
            newAccount={newAccount}
            setNewAccount={setNewAccount}
            handleAddAccount={handleAddAccount}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account List</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
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
              {filteredAccounts.map((account) => (
                <AccountRow
                  key={account.id}
                  account={account}
                  handleUpdateAccount={handleUpdateAccount}
                  handleDeleteAccount={handleDeleteAccount}
                />
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            Total Accounts: {filteredAccounts.length}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Accounts