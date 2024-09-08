import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecords } from '../integrations/supabase/hooks/records'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const Dashboard = () => {
  const { session } = useSupabaseAuth()
  const { data: records, isLoading, error } = useRecords(session?.user?.id)

  if (isLoading) return <div>Loading dashboard...</div>
  if (error) return <div>Error loading dashboard: {error.message}</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{records?.length || 0}</p>
        </CardContent>
      </Card>
      {/* Add more dashboard cards here as needed */}
    </div>
  )
}

export default Dashboard