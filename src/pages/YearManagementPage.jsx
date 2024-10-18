import React, { useState } from 'react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from 'sonner'

const YearManagementPage = () => {
  const { session } = useSupabaseAuth()
  const [newYear, setNewYear] = useState('')
  const queryClient = useQueryClient()

  const { data: years, isLoading } = useQuery({
    queryKey: ['fiscal-years', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiscal_years')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('year', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const addYearMutation = useMutation({
    mutationFn: async (year) => {
      const { data, error } = await supabase
        .from('fiscal_years')
        .insert([{ year, user_id: session?.user?.id }])
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fiscal-years', session?.user?.id])
      toast.success('Fiscal year added successfully')
      setNewYear('')
    },
    onError: (error) => {
      toast.error(`Error adding fiscal year: ${error.message}`)
    },
  })

  const handleAddYear = (e) => {
    e.preventDefault()
    if (!newYear) {
      toast.error('Please enter a valid year')
      return
    }
    addYearMutation.mutate(newYear)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Fiscal Year</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddYear} className="flex space-x-2">
              <Input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="Enter year (e.g., 2024)"
                className="max-w-xs"
              />
              <Button type="submit">Add Year</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fiscal Years</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {years?.map((year) => (
                  <TableRow key={year.id}>
                    <TableCell>{year.year}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default YearManagementPage