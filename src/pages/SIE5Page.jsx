import React, { useState } from 'react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useOpeningBalances } from '../integrations/supabase/hooks/openingBalances'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { UploadIcon, DownloadIcon } from 'lucide-react'
import { exportToSIE5, importFromSIE5 } from '../utils/sie5Utils'

const SIE5Page = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions } = useTransactions(session?.user?.id)
  const { data: accounts } = useAccounts(session?.user?.id)
  const { data: openingBalances } = useOpeningBalances(session?.user?.id)
  const [importing, setImporting] = useState(false)

  const handleExport = async () => {
    try {
      const sie5Data = await exportToSIE5(transactions, accounts, openingBalances, session?.user)
      const blob = new Blob([sie5Data], { type: 'application/xml' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'export.sie'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('SIE5 file exported successfully')
    } catch (error) {
      toast.error('Error exporting SIE5 file: ' + error.message)
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setImporting(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const xmlData = e.target.result
          await importFromSIE5(xmlData, session?.user?.id)
          toast.success('SIE5 file imported successfully')
        } catch (error) {
          toast.error('Error importing SIE5 file: ' + error.message)
        } finally {
          setImporting(false)
        }
      }
      reader.readAsText(file)
    } catch (error) {
      toast.error('Error reading file: ' + error.message)
      setImporting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SIE5 Import/Export</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export SIE5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Export all your transactions, accounts, and balances to a SIE5 file.</p>
            <Button onClick={handleExport}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export SIE5
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import SIE5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Import transactions, accounts, and balances from a SIE5 file.</p>
            <Button disabled={importing} onClick={() => document.getElementById('sie5-import').click()}>
              <UploadIcon className="mr-2 h-4 w-4" />
              {importing ? 'Importing...' : 'Import SIE5'}
            </Button>
            <input
              id="sie5-import"
              type="file"
              accept=".sie"
              className="hidden"
              onChange={handleImport}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SIE5Page