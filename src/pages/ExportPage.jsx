import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { useTransactions } from '../integrations/supabase/hooks/transactions'

const ExportPage = () => {
  const { session } = useSupabaseAuth()
  const { data: transactions } = useTransactions(session?.user?.id)

  const handleExportCSV = () => {
    if (!transactions) {
      toast.error("No data to export")
      return
    }

    const csvContent = [
      ["Date", "Account", "Debit", "Credit", "Reference"],
      ...transactions.map(t => [
        t.date,
        t.account,
        t.debit,
        t.credit,
        t.ver
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Export completed successfully")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Export Data</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Transactions</CardTitle>
            <CardDescription>
              Export your transaction data in CSV format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportCSV}>
              Export to CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ExportPage