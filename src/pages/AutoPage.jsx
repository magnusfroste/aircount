import React, { useState } from 'react'
import { useAddTransaction } from '../integrations/supabase/hooks/transactions'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { toast } from 'sonner'
import ImageUploader from '../components/ImageUploader'
import TransactionPreview from '../components/TransactionPreview'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const AutoPage = () => {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const { session } = useSupabaseAuth()
  const addTransactionMutation = useAddTransaction()

  const handleTransactionsExtracted = (extractedData) => {
    setTransactions(extractedData)
  }

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleConfirmTransaction = async (doubleEntryTransactions) => {
    try {
      // Generate a single ver for all transactions in this group
      const ver = new Date().getTime().toString()
      
      const transactionsToAdd = doubleEntryTransactions.map(t => ({
        date: t.date,
        account: t.account,
        debit: t.debit,
        credit: t.credit,
        description: t.description,
        ver: ver,
        user_id: session.user.id
      }))

      console.log('Attempting to save transactions:', transactionsToAdd)
      await addTransactionMutation.mutateAsync(transactionsToAdd)
      toast.success('Transactions added successfully')
      setSelectedTransaction(null)
    } catch (error) {
      console.error('Error adding transactions:', error)
      toast.error('Failed to add transactions')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <ImageUploader onTransactionsExtracted={handleTransactionsExtracted} />

      {transactions.length > 0 && !selectedTransaction && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={false}
                        onCheckedChange={() => handleTransactionSelect(transaction)}
                      />
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      {transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedTransaction && (
        <TransactionPreview
          bankTransaction={selectedTransaction}
          onConfirm={handleConfirmTransaction}
          onCancel={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  )
}

export default AutoPage