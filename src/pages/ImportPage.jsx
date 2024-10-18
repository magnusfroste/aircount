import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ImportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Import Your Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The import functionality has been moved to the Admin page. Please go to the Admin page to import your data.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ImportPage