import React, { useState } from 'react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { parseSEFile } from '../utils/seFileParser'
import { ibm437ToUnicode } from '../utils/encodingUtils'
import { useImportTransactions } from '../integrations/supabase/hooks/transactions'
import { useFiscalYear } from '../contexts/FiscalYearContext'

const ImportPage = () => {
  const { session } = useSupabaseAuth()
  const [file, setFile] = useState(null)
  const importTransactionsMutation = useImportTransactions()
  const { selectedYear } = useFiscalYear()

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleImport = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file to import')
      return
    }

    try {
      const fileContent = await file.text() // Use text() instead of arrayBuffer()

      let decodedContent = fileContent

      // If UTF-8 decoding fails, try IBM-437
      if (decodedContent.includes('�')) {
        const buffer = await file.arrayBuffer()
        decodedContent = ibm437ToUnicode(new Uint8Array(buffer))
      }

      const transactions = parseSEFile(decodedContent)

      // Import transactions using the mutation
      importTransactionsMutation.mutate(
        { transactions, userId: session.user.id, fiscalYear: selectedYear },
        {
          onSuccess: () => {
            toast.success(`Successfully imported ${transactions.length} transactions`)
            setFile(null)
          },
          onError: (error) => {
            toast.error(`Error importing transactions: ${error.message}`)
          }
        }
      )
    } catch (error) {
      console.error('Error importing file:', error)
      toast.error('Error importing file: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Import Your Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImport} className="space-y-4">
              <Input 
                type="file" 
                accept=".se,.si" 
                onChange={handleFileChange} 
                required 
              />
              <Button type="submit" disabled={importTransactionsMutation.isPending}>
                {importTransactionsMutation.isPending ? 'Importing...' : 'Import'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ImportPage