import React from 'react'
import { Button } from "@/components/ui/button"
import { Upload, Trash2 } from 'lucide-react'

const ImportButtons = ({ handleImportClick, handleJsonImportClick, handleDeleteAllAccounts }) => {
  return (
    <div className="mb-4 flex space-x-2">
      <Button onClick={handleImportClick} variant="outline">
        <Upload className="mr-2 h-4 w-4" /> Import .SE
      </Button>
      <Button onClick={handleJsonImportClick} variant="outline">
        <Upload className="mr-2 h-4 w-4" /> Import JSON
      </Button>
      <Button onClick={handleDeleteAllAccounts} variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" /> Delete All Accounts
      </Button>
    </div>
  )
}

export default ImportButtons