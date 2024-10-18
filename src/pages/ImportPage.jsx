import React, { useState } from 'react'
import Header from '../components/Header'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { parseSEFile } from '../utils/seFileParser'
import { ibm437ToUnicode } from '../utils/encodingUtils'

const ImportPage = () => {
  const { session } = useSupabaseAuth()
  const [file, setFile] = useState(null)

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
      const fileContent = await file.arrayBuffer()
      const decoder = new TextDecoder('utf-8')
      let decodedContent = decoder.decode(new Uint8Array(fileContent))

      // If UTF-8 decoding fails, try IBM-437
      if (decodedContent.includes('�')) {
        decodedContent = ibm437ToUnicode(new Uint8Array(fileContent))
      }

      const transactions = parseSEFile(decodedContent)

      // Here you would typically save the transactions to your database
      // For now, we'll just log them and show a success message
      console.log('Parsed transactions:', transactions)
      toast.success(`Successfully imported ${transactions.length} transactions`)
    } catch (error) {
      console.error('Error importing file:', error)
      toast.error('Error importing file: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Import Your Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImport} className="space-y-4">
              <Input type="file" accept=".se,.si" onChange={handleFileChange} required />
              <Button type="submit">Import</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ImportPage