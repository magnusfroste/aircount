import React from 'react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'

const OpeningBalancesPage = () => {
  const { session } = useSupabaseAuth()
  const [newBalance, setNewBalance] = React.useState(0)

  const handleAddBalance = async (e) => {
    e.preventDefault()
    try {
      // Logic to add the new balance
      toast.success('Balance added successfully')
      setNewBalance(0)
    } catch (error) {
      toast.error(`Error adding balance: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Opening Balances</h1>
        <Card>
          <CardHeader>
            <CardTitle>Add Opening Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBalance} className="space-y-4">
              <Input
                type="number"
                placeholder="New Balance"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                required
              />
              <Button type="submit">Add Balance</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OpeningBalancesPage