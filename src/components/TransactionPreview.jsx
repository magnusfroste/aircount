import React, { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTemplates } from '../integrations/supabase/hooks/templates'

const TransactionPreview = ({ bankTransaction, onConfirm, onCancel }) => {
  const [ver, setVer] = useState('')
  const [customTransactions, setCustomTransactions] = useState([])
  const { data: templates } = useTemplates()

  // Find matching template based on description
  const matchingTemplate = useMemo(() => {
    if (!templates || !bankTransaction) return null
    
    return templates.find(template => 
      bankTransaction.description.toLowerCase().includes(template.name.toLowerCase())
    )
  }, [templates, bankTransaction])

  // Generate transactions based on template or default logic
  const doubleEntryTransactions = useMemo(() => {
    if (!bankTransaction) return []
    
    if (matchingTemplate) {
      // Use template values but adjust based on actual amount
      const absAmount = Math.abs(bankTransaction.amount)
      const scaleFactor = absAmount / (matchingTemplate.debit || matchingTemplate.credit)
      
      return [
        {
          account: matchingTemplate.account_number,
          description: bankTransaction.description,
          debit: matchingTemplate.debit * scaleFactor,
          credit: matchingTemplate.credit * scaleFactor,
          date: bankTransaction.date,
        },
        {
          account: '1930', // Bank account
          description: bankTransaction.description,
          debit: matchingTemplate.credit * scaleFactor,
          credit: matchingTemplate.debit * scaleFactor,
          date: bankTransaction.date,
        }
      ]
    }
    
    // Default logic if no template matches
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
  }, [bankTransaction, matchingTemplate])

  // Combine template-based and custom transactions
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
              {allTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index >= doubleEntryTransactions.length ? (
                      <Input
                        type="text"
                        value={transaction.account}
                        onChange={(e) => handleUpdateCustomRow(index - doubleEntryTransactions.length, 'account', e.target.value)}
                      />
                    ) : (
                      transaction.account
                    )}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {index >= doubleEntryTransactions.length ? (
                      <Input
                        type="number"
                        value={transaction.debit}
                        onChange={(e) => handleUpdateCustomRow(index - doubleEntryTransactions.length, 'debit', e.target.value)}
                      />
                    ) : (
                      transaction.debit
                    )}
                  </TableCell>
                  <TableCell>
                    {index >= doubleEntryTransactions.length ? (
                      <Input
                        type="number"
                        value={transaction.credit}
                        onChange={(e) => handleUpdateCustomRow(index - doubleEntryTransactions.length, 'credit', e.target.value)}
                      />
                    ) : (
                      transaction.credit
                    )}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
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