import React, { useState, useMemo } from 'react'
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTemplates } from '../integrations/supabase/hooks/templates'
import { findMatchingTemplate, generateTransactions } from '../utils/templateMatching'
import BankTransactionDetails from './BankTransactionDetails'
import TransactionRows from './TransactionRows'

const TransactionPreview = ({ bankTransaction, onConfirm, onCancel }) => {
  const [ver, setVer] = useState('')
  const [customTransactions, setCustomTransactions] = useState([])
  const { data: templates } = useTemplates()

  const matchingTemplate = useMemo(() => 
    findMatchingTemplate(templates, bankTransaction), 
    [templates, bankTransaction]
  )

  const doubleEntryTransactions = useMemo(() => 
    generateTransactions(bankTransaction, matchingTemplate), 
    [bankTransaction, matchingTemplate]
  )

  const allTransactions = [...doubleEntryTransactions, ...customTransactions]

  const handleAddRow = () => {
    setCustomTransactions([...customTransactions, {
      account: '',
      description: bankTransaction?.description || '',
      debit: 0,
      credit: 0,
      date: bankTransaction?.date || '',
    }])
  }

  const handleUpdateCustomRow = (index, field, value) => {
    const updatedTransactions = [...customTransactions]
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      [field]: field === 'account' ? value : parseFloat(value) || 0
    }
    setCustomTransactions(updatedTransactions)
  }

  const handleConfirm = () => {
    const verNumber = parseInt(ver, 10)
    if (!verNumber || isNaN(verNumber)) {
      alert('Please enter a valid ver number')
      return
    }
    onConfirm(allTransactions, verNumber)
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Double-Entry Preview</CardTitle>
        {matchingTemplate && (
          <div className="text-sm text-muted-foreground">
            Using template: {matchingTemplate.name}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <BankTransactionDetails bankTransaction={bankTransaction} />

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
            <TransactionRows 
              allTransactions={allTransactions}
              doubleEntryTransactions={doubleEntryTransactions}
              handleUpdateCustomRow={handleUpdateCustomRow}
            />
          </Table>
          
          <Button onClick={handleAddRow} className="mt-4">
            Add Row
          </Button>
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