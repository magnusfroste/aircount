import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { parseSEFile, detectEncoding } from '../utils/seFileParser'
import { useImportAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const ImportPage = () => {
  const fileInputRef = useRef(null)
  const { session } = useSupabaseAuth()
  const importAccountsMutation = useImportAccounts()
  const [isImporting, setIsImporting] = useState(false)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setIsImporting(true)
      try {
        const content = await file.text()
        console.log(`File content length: ${content.length} characters`);
        const detectedEncoding = detectEncoding(content);
        console.log(`Detected encoding: ${detectedEncoding}`);
        const parsedContent = parseSEFile(content, detectedEncoding)
        
        if (parsedContent.length === 0) {
          throw new Error('No valid accounts found in the file')
        }

        const validAccounts = parsedContent.filter(account => account.account && account.account_name)
        
        if (validAccounts.length === 0) {
          throw new Error('No valid accounts found after filtering')
        }

        await importAccountsMutation.mutateAsync({ accounts: validAccounts, userId: session.user.id })
        toast.success(`Successfully imported ${validAccounts.length} accounts`)
      } catch (error) {
        console.error('Error importing file:', error)
        toast.error(`Error importing file: ${error.message}`)
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
    </div>
  )
}

export default ImportPage