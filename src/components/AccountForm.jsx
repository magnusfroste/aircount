import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon } from 'lucide-react'

const AccountForm = ({ newAccount, setNewAccount, handleAddAccount }) => {
  return (
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
}

export default AccountForm