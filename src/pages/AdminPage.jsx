import React, { useState } from 'react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from 'sonner'
import { parseSEFile } from '../utils/seFileParser'
import { ibm437ToUnicode } from '../utils/encodingUtils'
import { useImportTransactions } from '../integrations/supabase/hooks/transactions'
import { useFiscalYear } from '../contexts/FiscalYearContext'

const AdminPage = () => {
  const { session } = useSupabaseAuth()
  const [newYear, setNewYear] = useState('')
  const [file, setFile] = useState(null)
  const queryClient = useQueryClient()
  const importTransactionsMutation = useImportTransactions()
  const { selectedYear } = useFiscalYear()

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleImport = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file to import')
      return
    }

    try {
      const fileContent = await file.arrayBuffer()
      const decoder = new TextDecoder('utf-8')
      let decodedContent = decoder.decode(new Uint8Array(fileContent))

      // If UTF-8 decoding fails, try IBM-437
      if (decodedContent.includes('�')) {
        decodedContent = ibm437ToUnicode(new Uint8Array(fileContent))
      }

      const transactions = parseSEFile(decodedContent)

      // Import transactions using the mutation
      importTransactionsMutation.mutate(
        { transactions, userId: session.user.id, fiscalYear: selectedYear },
        {
          onSuccess: () => {
            toast.success(`Successfully imported ${transactions.length} transactions`)
            setFile(null)
          },
          onError: (error) => {
            toast.error(`Error importing transactions: ${error.message}`)
          }
        }
      )
    } catch (error) {
      console.error('Error importing file:', error)
      toast.error('Error importing file: ' + error.message)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Import Your Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleImport} className="space-y-4">
            <Input 
              type="file" 
              accept=".se,.si" 
              onChange={handleFileChange} 
              required 
            />
            <Button type="submit" disabled={importTransactionsMutation.isPending}>
              {importTransactionsMutation.isPending ? 'Importing...' : 'Import'}
            </Button>
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
  )
}

export default AdminPage