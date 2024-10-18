import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon } from 'lucide-react'

const TransactionForm = ({ newTransaction, setNewTransaction, accounts, handleAddTransaction }) => (
  <div className="mb-4 flex space-x-2">
    <Input
      type="text"
      placeholder="Nr"
      value={newTransaction.ver}
      onChange={(e) => setNewTransaction({ ...newTransaction, ver: e.target.value })}
    />
    <Input
      type="date"
      value={newTransaction.date}
      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
    />
    <Select
      value={newTransaction.account}
      onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
    >
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.account}>
            {account.account} - {account.account_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Input
      type="number"
      placeholder="Debit"
      value={newTransaction.debit}
      onChange={(e) => setNewTransaction({ ...newTransaction, debit: parseFloat(e.target.value) })}
    />
    <Input
      type="number"
      placeholder="Credit"
      value={newTransaction.credit}
      onChange={(e) => setNewTransaction({ ...newTransaction, credit: parseFloat(e.target.value) })}
    />
    <Button onClick={handleAddTransaction}>
      <PlusIcon className="mr-2 h-4 w-4" /> Add
    </Button>
  </div>
)

export default TransactionForm