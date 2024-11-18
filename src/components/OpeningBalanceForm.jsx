import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from 'lucide-react'

const OpeningBalanceForm = ({ accounts, newBalance, setNewBalance, handleAddBalance }) => {
  return (
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
  )
}

export default OpeningBalanceForm