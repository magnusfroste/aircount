import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from 'lucide-react'

const KPICards = ({ transactions }) => {
  // Calculate KPIs based on transactions
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.credit > t.debit ? t.credit : 0), 0)
  const averageTransactionValue = totalRevenue / transactions.length || 0
  const transactionCount = transactions.length

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Key Performance Indicators</CardTitle>
        <Target className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-muted-foreground">Total Revenue</dt>
            <dd className="text-2xl font-bold">{totalRevenue.toFixed(2)} SEK</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Avg. Transaction Value</dt>
            <dd className="text-2xl font-bold">{averageTransactionValue.toFixed(2)} SEK</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Transaction Count</dt>
            <dd className="text-2xl font-bold">{transactionCount}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

export default KPICards