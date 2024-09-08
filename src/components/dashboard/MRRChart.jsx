import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingDown } from 'lucide-react'

const MRRChart = () => {
  // Simulated MRR data
  const mrrData = [
    { month: 'Jan', mrr: 4000 },
    { month: 'Feb', mrr: 4200 },
    { month: 'Mar', mrr: 4500 },
    { month: 'Apr', mrr: 4800 },
    { month: 'May', mrr: 5000 },
    { month: 'Jun', mrr: 5200 },
  ]

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
        <TrendingDown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mrrData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="mrr" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default MRRChart