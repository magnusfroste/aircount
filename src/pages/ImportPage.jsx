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
    console.log('File selected:', e.target.files[0]?.name)
  }

  const handleImport = async (e) => {
    e.preventDefault()
    console.log('Import button clicked')
    if (!file) {
      console.log('No file selected')
      toast.error('Please select a file to import')
      return
    }

    try {
      console.log('Starting file import process')
      const fileContent = await file.arrayBuffer()
      console.log('File content read as ArrayBuffer')
      const decoder = new TextDecoder('utf-8')
      let decodedContent = decoder.decode(new Uint8Array(fileContent))
      console.log('Initial UTF-8 decoding completed')

      // If UTF-8 decoding fails, try IBM-437
      if (decodedContent.includes('�')) {
        console.log('UTF-8 decoding failed, trying IBM-437')
        decodedContent = ibm437ToUnicode(new Uint8Array(fileContent))
        console.log('IBM-437 decoding completed')
      }

      console.log('Parsing file content')
      const transactions = parseSEFile(decodedContent)
      console.log(`Parsed ${transactions.length} transactions`)

      console.log('Importing transactions')
      importTransactionsMutation.mutate(
        { transactions, userId: session.user.id, fiscalYear: selectedYear },
        {
          onSuccess: () => {
            console.log('Import successful')
            toast.success(`Successfully imported ${transactions.length} transactions`)
            setFile(null)
          },
          onError: (error) => {
            console.error('Import error:', error)
            toast.error(`Error importing transactions: ${error.message}`)
          }
        }
      )
    } catch (error) {
      console.error('Error in import process:', error)
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