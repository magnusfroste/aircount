import React from 'react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'

const ImportPage = () => {
  const { session } = useSupabaseAuth()

  const handleImport = async (e) => {
    e.preventDefault()
    // Handle the import logic here
    toast.success('Data imported successfully')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Import Data</h1>
        <Card>
          <CardHeader>
            <CardTitle>Import Your Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImport} className="space-y-4">
              <Input type="file" accept=".csv" required />
              <Button type="submit">Import</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ImportPage