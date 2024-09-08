import React, { useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { parseSEFile } from '../utils/seFileParser'
import { useImportAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const ImportPage = () => {
  const fileInputRef = useRef(null)
  const { session } = useSupabaseAuth()
  const importAccountsMutation = useImportAccounts()

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const content = await file.text()
        const parsedContent = parseSEFile(content)
        await importAccountsMutation.mutateAsync({ accounts: parsedContent, userId: session.user.id })
        toast.success('File imported successfully')
      } catch (error) {
        console.error('Error importing file:', error)
        toast.error(`Error importing file: ${error.message}`)
      }
      event.target.value = '' // Reset the file input
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
        />
        <Button onClick={() => fileInputRef.current.click()}>
          Import .SE File
        </Button>
      </div>
    </div>
  )
}

export default ImportPage