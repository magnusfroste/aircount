import React, { useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SelectedTransactions = ({ 
  selectedTemplates, 
  templates, 
  accounts, 
  transactionDate, 
  onAddTransactions, 
  editedTransactions, 
  setEditedTransactions, 
  accountBalances 
}) => {
  const selectedTransactionTemplates = templates.filter(template => selectedTemplates.includes(template.id))

  const handleEdit = (id, field, value) => {
    setEditedTransactions(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: parseFloat(value) || 0 }
    }))
  }

  const sums = useMemo(() => {
    return selectedTransactionTemplates.reduce((acc, template) => {
      const editedTransaction = editedTransactions[template.id] || {}
      acc.debit += editedTransaction.debit ?? template.debit
      acc.credit += editedTransaction.credit ?? template.credit
      return acc
    }, { debit: 0, credit: 0 })
  }, [selectedTransactionTemplates, editedTransactions])

  const difference = sums.debit - sums.credit

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Selected Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Input
            type="date"
            value={transactionDate}
            onChange={(e) => onAddTransactions(e.target.value)}
            className="w-48"
          />
          <Button 
            onClick={() => onAddTransactions(transactionDate, editedTransactions)}
            disabled={selectedTemplates.length === 0}
          >
            Add Selected Transactions
          </Button>
        </div>
        {selectedTransactionTemplates.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Current Balance</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTransactionTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.account_number} - {accounts.find(acc => acc.account === template.account_number)?.account_name || 'Unknown Account'}</TableCell>
                  <TableCell>{accountBalances[template.account_number]?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editedTransactions[template.id]?.debit ?? template.debit}
                      onChange={(e) => handleEdit(template.id, 'debit', e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editedTransactions[template.id]?.credit ?? template.credit}
                      onChange={(e) => handleEdit(template.id, 'credit', e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell>{sums.debit.toFixed(2)}</TableCell>
                <TableCell>{sums.credit.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className={difference === 0 ? "text-green-600" : "text-red-600"}>
                <TableCell colSpan={4}>Difference (Debit - Credit)</TableCell>
                <TableCell>{difference.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p>No transactions selected</p>
        )}
      </CardContent>
    </Card>
  )
}

export default SelectedTransactions