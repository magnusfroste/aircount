import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const TransactionPreview = ({ bankTransaction, onConfirm, onCancel }) => {
  // Generate double-entry transactions based on the bank transaction
  const doubleEntryTransactions = React.useMemo(() => {
    if (!bankTransaction) return []
    
    // If it's a debit (negative amount), money is going out
    // If it's a credit (positive amount), money is coming in
    const isDebit = bankTransaction.amount < 0
    const absAmount = Math.abs(bankTransaction.amount)
    
    if (isDebit) {
      return [
        {
          account: '4000', // Expense account (placeholder)
          description: bankTransaction.description,
          debit: absAmount,
          credit: 0
        },
        {
          account: '1930', // Bank account
          description: bankTransaction.description,
          debit: 0,
          credit: absAmount
        }
      ]
    } else {
      return [
        {
          account: '1930', // Bank account
          description: bankTransaction.description,
          debit: absAmount,
          credit: 0
        },
        {
          account: '3000', // Income account (placeholder)
          description: bankTransaction.description,
          debit: 0,
          credit: absAmount
        }
      ]
    }
  }, [bankTransaction])

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Double-Entry Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Original Bank Transaction:</h3>
          <p>Date: {bankTransaction.date}</p>
          <p>Description: {bankTransaction.description}</p>
          <p>Amount: {bankTransaction.amount}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Generated Double-Entry Transactions:</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doubleEntryTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.debit}</TableCell>
                  <TableCell>{transaction.credit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => onConfirm(doubleEntryTransactions)}>
            Confirm and Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TransactionPreview