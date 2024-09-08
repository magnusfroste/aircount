import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { parseSEFile, detectEncoding } from '../utils/seFileParser'
import { useImportAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ImportPage = () => {
  const fileInputRef = useRef(null)
  const { session } = useSupabaseAuth()
  const importAccountsMutation = useImportAccounts()
  const [isImporting, setIsImporting] = useState(false)
  const [fileInfo, setFileInfo] = useState(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setIsImporting(true)
      try {
        const content = await file.text()
        const contentLength = content.length
        const detectedEncoding = detectEncoding(content)
        console.log(`File content length: ${contentLength} characters`)
        console.log(`Detected encoding: ${detectedEncoding}`)
        
        const parsedContent = parseSEFile(content, detectedEncoding)
        
        if (parsedContent.length === 0) {
          throw new Error('No valid accounts found in the file')
        }

        const validAccounts = parsedContent.filter(account => account.account && account.account_name)
        
        if (validAccounts.length === 0) {
          throw new Error('No valid accounts found after filtering')
        }

        setFileInfo({
          name: file.name,
          size: file.size,
          contentLength,
          detectedEncoding,
          totalLinesParsed: parsedContent.totalLinesParsed,
          kontoLinesFound: parsedContent.kontoLinesFound,
          validAccountsExtracted: validAccounts.length
        })

        await importAccountsMutation.mutateAsync({ accounts: validAccounts, userId: session.user.id })
        toast.success(`Successfully imported ${validAccounts.length} accounts`)
      } catch (error) {
        console.error('Error importing file:', error)
        toast.error(`Error importing file: ${error.message}`)
        setFileInfo({
          error: error.message,
          ...fileInfo
        })
      } finally {
        setIsImporting(false)
        event.target.value = '' // Reset the file input
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Import .SE File</h1>
      <div className="mb-4">
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".se"
          onChange={handleFileUpload}
          disabled={isImporting}
        />
        <Button onClick={() => fileInputRef.current.click()} disabled={isImporting}>
          {isImporting ? 'Importing...' : 'Import .SE File'}
        </Button>
      </div>
      {fileInfo && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>File Import Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>File Name:</strong> {fileInfo.name}</p>
            <p><strong>File Size:</strong> {fileInfo.size} bytes</p>
            <p><strong>Content Length:</strong> {fileInfo.contentLength} characters</p>
            <p><strong>Detected Encoding:</strong> {fileInfo.detectedEncoding}</p>
            <p><strong>Total Lines Parsed:</strong> {fileInfo.totalLinesParsed}</p>
            <p><strong>KONTO Lines Found:</strong> {fileInfo.kontoLinesFound}</p>
            <p><strong>Valid Accounts Extracted:</strong> {fileInfo.validAccountsExtracted}</p>
            {fileInfo.error && <p className="text-red-500"><strong>Error:</strong> {fileInfo.error}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ImportPage