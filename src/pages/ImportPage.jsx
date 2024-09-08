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
  const [originalContent, setOriginalContent] = useState('')
  const [decodedContent, setDecodedContent] = useState('')
  const [originalEncoding, setOriginalEncoding] = useState('')
  const [finalEncoding, setFinalEncoding] = useState('')

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setIsImporting(true)
      try {
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const detectedEncoding = detectEncoding(uint8Array)
        setOriginalEncoding(detectedEncoding)
        
        const { accounts, decodedContent, originalEncoding } = parseSEFile(uint8Array)
        setOriginalContent(new TextDecoder('utf-8').decode(uint8Array))
        setDecodedContent(decodedContent)
        setFinalEncoding(originalEncoding)
        
        const validAccounts = accounts.filter(acc => acc.account && acc.account_name)
        if (validAccounts.length === 0) {
          throw new Error('No valid accounts found in the file. Each account must have both an account number and a name.')
        }

        setFileInfo({
          name: file.name,
          size: file.size,
          contentLength: decodedContent.length,
          originalEncoding: detectedEncoding,
          finalEncoding: originalEncoding,
          totalLinesParsed: decodedContent.split('\n').length,
          validAccountsExtracted: validAccounts.length,
          invalidAccountsCount: accounts.length - validAccounts.length
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
        event.target.value = ''
      }
    }
  }

  const handleSaveToAccounts = async () => {
    if (parsedAccounts && parsedAccounts.length > 0) {
      try {
        await importAccountsMutation.mutateAsync({ accounts: parsedAccounts, userId: session.user.id })
        toast.success(`Successfully imported ${parsedAccounts.length} accounts`)
        setParsedAccounts(null)
        setOriginalContent('')
        setDecodedContent('')
        setFileInfo(null)
      } catch (error) {
        console.error('Error saving accounts:', error)
        toast.error(`Error saving accounts: ${error.message}`)
      }
    } else {
      toast.error('No valid accounts to import')
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
      {originalContent && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Original File Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={originalContent} readOnly rows={10} />
          </CardContent>
        </Card>
      )}
      {decodedContent && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Decoded File Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={decodedContent} readOnly rows={10} />
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
            <p><strong>Final Detected Encoding:</strong> {finalEncoding}</p>
            <p><strong>Total Lines Parsed:</strong> {fileInfo.totalLinesParsed}</p>
            <p><strong>Valid Accounts Extracted:</strong> {fileInfo.validAccountsExtracted}</p>
            <p><strong>Invalid Accounts Found:</strong> {fileInfo.invalidAccountsCount}</p>
            {fileInfo.error && <p className="text-red-500"><strong>Error:</strong> {fileInfo.error}</p>}
          </CardContent>
        </Card>
      )}
      {parsedAccounts && parsedAccounts.length > 0 && (
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