import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const AccountTable = ({ accounts, handleUpdateAccount, handleDeleteAccount }) => {
  return (
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
                  } else {
                    toast.error('Account number and name are required')
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
  )
}

export default AccountTable