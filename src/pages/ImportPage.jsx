import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { parseSEFile, detectEncoding } from '../utils/seFileParser'
import { useImportAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const ImportPage = () => {
  const fileInputRef = useRef(null)
  const { session } = useSupabaseAuth()
  const importAccountsMutation = useImportAccounts()
  const [isImporting, setIsImporting] = useState(false)
  const [fileInfo, setFileInfo] = useState(null)
  const [parsedAccounts, setParsedAccounts] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [originalEncoding, setOriginalEncoding] = useState('')
  const [processedEncoding, setProcessedEncoding] = useState('')

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setIsImporting(true)
      try {
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const decoder = new TextDecoder('utf-8', { fatal: true })
        let decodedContent
        try {
          decodedContent = decoder.decode(uint8Array)
        } catch (error) {
          // If UTF-8 decoding fails, use ISO-8859-1
          const fallbackDecoder = new TextDecoder('iso-8859-1')
          decodedContent = fallbackDecoder.decode(uint8Array)
        }
        setFileContent(decodedContent)
        const contentLength = decodedContent.length
        const detectedEncoding = detectEncoding(decodedContent)
        setOriginalEncoding(detectedEncoding)
        console.log(`File content length: ${contentLength} characters`)
        console.log(`Detected encoding: ${detectedEncoding}`)
        
        const parsedContent = parseSEFile(decodedContent)
        setProcessedEncoding(detectEncoding(JSON.stringify(parsedContent)))
        
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

        setParsedAccounts(validAccounts)
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

  const handleSaveToAccounts = async () => {
    if (parsedAccounts) {
      try {
        await importAccountsMutation.mutateAsync({ accounts: parsedAccounts, userId: session.user.id })
        toast.success(`Successfully imported ${parsedAccounts.length} accounts`)
        setParsedAccounts(null)
        setFileContent('')
        setFileInfo(null)
      } catch (error) {
        console.error('Error saving accounts:', error)
        toast.error(`Error saving accounts: ${error.message}`)
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
      {fileContent && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>File Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={fileContent} readOnly rows={10} />
          </CardContent>
        </Card>
      )}
      {fileInfo && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>File Import Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>File Name:</strong> {fileInfo.name}</p>
            <p><strong>File Size:</strong> {fileInfo.size} bytes</p>
            <p><strong>Content Length:</strong> {fileInfo.contentLength} characters</p>
            <p><strong>Original Detected Encoding:</strong> {originalEncoding}</p>
            <p><strong>Processed Encoding:</strong> {processedEncoding}</p>
            <p><strong>Total Lines Parsed:</strong> {fileInfo.totalLinesParsed}</p>
            <p><strong>KONTO Lines Found:</strong> {fileInfo.kontoLinesFound}</p>
            <p><strong>Valid Accounts Extracted:</strong> {fileInfo.validAccountsExtracted}</p>
            {fileInfo.error && <p className="text-red-500"><strong>Error:</strong> {fileInfo.error}</p>}
          </CardContent>
        </Card>
      )}
      {parsedAccounts && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Parsed Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={JSON.stringify(parsedAccounts, null, 2)} readOnly rows={10} />
            <Button onClick={handleSaveToAccounts} className="mt-4">Save to Accounts</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ImportPage