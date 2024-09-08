import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { ibm437ToUnicode } from '../utils/encodingUtils'
import { useImportAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const ImportPage = () => {
  const [originalContent, setOriginalContent] = useState('')
  const [decodedContent, setDecodedContent] = useState('')
  const importAccountsMutation = useImportAccounts()
  const { session } = useSupabaseAuth()

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        
        setOriginalContent(new TextDecoder('utf-8').decode(uint8Array))

        const decodedText = ibm437ToUnicode(uint8Array)
        setDecodedContent(decodedText)

        toast.success('File uploaded and decoded successfully')
      } catch (error) {
        console.error('Error reading file:', error)
        toast.error(`Error reading file: ${error.message}`)
      }
    }
  }

  const parseAccounts = (content) => {
    const lines = content.split('\n')
    const accounts = []
    for (const line of lines) {
      if (line.startsWith('#KONTO')) {
        const [, number, ...nameParts] = line.split(' ')
        const name = nameParts.join(' ').trim()
        accounts.push({ number, name })
      }
    }
    return accounts
  }

  const handleImportAccounts = async () => {
    if (!decodedContent) {
      toast.error('No decoded content to import')
      return
    }

    const accounts = parseAccounts(decodedContent)
    if (accounts.length === 0) {
      toast.error('No accounts found in the decoded content')
      return
    }

    try {
      await importAccountsMutation.mutateAsync({ accounts, userId: session.user.id })
      toast.success(`Successfully imported ${accounts.length} accounts`)
    } catch (error) {
      console.error('Error importing accounts:', error)
      toast.error(`Error importing accounts: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Import .SE File</h1>
      <Input
        type="file"
        accept=".se"
        onChange={handleFileUpload}
        className="mb-4"
      />
      <Button onClick={handleImportAccounts} className="mb-4">
        Import Accounts
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Original Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{originalContent}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Decoded Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{decodedContent}</pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ImportPage