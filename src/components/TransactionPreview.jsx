import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TransactionPreview = ({ bankTransaction, onConfirm, onCancel }) => {
  const [ver, setVer] = useState('')

  const doubleEntryTransactions = React.useMemo(() => {
    if (!bankTransaction) return []
    
    const isDebit = bankTransaction.amount < 0
    const absAmount = Math.abs(bankTransaction.amount)
    
    if (isDebit) {
      return [
        {
          account: '4000',
          description: bankTransaction.description,
          debit: absAmount,
          credit: 0,
          date: bankTransaction.date,
        },
        {
          account: '1930',
          description: bankTransaction.description,
          debit: 0,
          credit: absAmount,
          date: bankTransaction.date,
        }
      ]
    } else {
      return [
        {
          account: '1930',
          description: bankTransaction.description,
          debit: absAmount,
          credit: 0,
          date: bankTransaction.date,
        },
        {
          account: '3000',
          description: bankTransaction.description,
          debit: 0,
          credit: absAmount,
          date: bankTransaction.date,
        }
      ]
    }
  }, [bankTransaction])

  const handleConfirm = () => {
    const verNumber = parseInt(ver, 10)
    if (!verNumber || isNaN(verNumber)) {
      alert('Please enter a valid ver number')
      return
    }
    onConfirm(doubleEntryTransactions, verNumber)
  }

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
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doubleEntryTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.debit}</TableCell>
                  <TableCell>{transaction.credit}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            type="number"
            placeholder="Enter ver number"
            value={ver}
            onChange={(e) => setVer(e.target.value)}
            className="w-48"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleConfirm}>
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