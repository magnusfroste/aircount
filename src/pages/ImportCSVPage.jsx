import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { useImportTransactions } from '../integrations/supabase/hooks/transactions'

const ImportCSVPage = () => {
  const { session } = useSupabaseAuth()
  const importTransactionsMutation = useImportTransactions()
  const [file, setFile] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type !== 'text/csv') {
      toast.error('Please upload a CSV file')
      return
    }
    setFile(file)
  }

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target.result
        const rows = text.split('\n').map(row => row.split(','))
        const headers = rows[0]
        
        // Validate headers
        const requiredHeaders = ['Date', 'Account', 'Debit', 'Credit', 'Reference']
        const hasAllHeaders = requiredHeaders.every(header => 
          headers.map(h => h.trim()).includes(header)
        )

        if (!hasAllHeaders) {
          toast.error('Invalid CSV format. Required columns: Date, Account, Debit, Credit, Reference')
          return
        }

        // Parse transactions
        const transactions = rows.slice(1)
          .filter(row => row.length === headers.length)
          .map(row => ({
            date: row[headers.indexOf('Date')].trim(),
            account: row[headers.indexOf('Account')].trim(),
            debit: parseFloat(row[headers.indexOf('Debit')]) || 0,
            credit: parseFloat(row[headers.indexOf('Credit')]) || 0,
            ver: row[headers.indexOf('Reference')].trim(),
            user_id: session.user.id
          }))

        if (transactions.length === 0) {
          toast.error('No valid transactions found in the CSV file')
          return
        }

        await importTransactionsMutation.mutateAsync({ 
          transactions, 
          userId: session.user.id 
        })
        
        toast.success(`Successfully imported ${transactions.length} transactions`)
        setFile(null)
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Failed to import transactions')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Import CSV</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Import Transactions from CSV</CardTitle>
            <CardDescription>
              Upload a CSV file containing transaction data. The file must include these columns: Date, Account, Debit, Credit, Reference
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mb-4"
            />
            <Button 
              onClick={handleImport}
              disabled={!file || importTransactionsMutation.isPending}
            >
              {importTransactionsMutation.isPending ? 'Importing...' : 'Import CSV'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ImportCSVPage