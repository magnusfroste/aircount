import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { toast } from 'sonner'

const Records = () => {
  const [newRecord, setNewRecord] = useState({ name: '', email: '', customField: '' })
  const queryClient = useQueryClient()
  const { session } = useSupabaseAuth()

  const { data: records, isLoading, error } = useQuery({
    queryKey: ['records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('user_id', session.user.id)
      if (error) throw error
      return data
    },
  })

  const addRecordMutation = useMutation({
    mutationFn: async (newRecord) => {
      const { data, error } = await supabase.rpc('insert_record', {
        p_user_id: session.user.id,
        p_record: newRecord
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['records'])
      setNewRecord({ name: '', email: '', customField: '' })
      toast.success('Record added successfully')
    },
    onError: (error) => {
      toast.error(`Failed to add record: ${error.message}`)
    }
  })

  const updateRecordMutation = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase
        .from('records')
        .update({ data: updateData })
        .eq('id', id)
        .eq('user_id', session.user.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['records'])
      toast.success('Record updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update record: ${error.message}`)
    }
  })

  const deleteRecordMutation = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('records')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['records'])
      toast.success('Record deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete record: ${error.message}`)
    }
  })

  const handleAddRecord = () => {
    addRecordMutation.mutate(newRecord)
  }

  const handleUpdateRecord = (id, updateData) => {
    updateRecordMutation.mutate({ id, ...updateData })
  }

  const handleDeleteRecord = (id) => {
    deleteRecordMutation.mutate(id)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Records</h1>
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Name"
          value={newRecord.name}
          onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={newRecord.email}
          onChange={(e) => setNewRecord({ ...newRecord, email: e.target.value })}
        />
        <Input
          placeholder="Custom Field"
          value={newRecord.customField}
          onChange={(e) => setNewRecord({ ...newRecord, customField: e.target.value })}
        />
        <Button onClick={handleAddRecord}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Custom Field</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records && records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.data?.name || 'N/A'}</TableCell>
              <TableCell>{record.data?.email || 'N/A'}</TableCell>
              <TableCell>{record.data?.customField || 'N/A'}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    const name = prompt('Enter new name', record.data?.name || '')
                    const email = prompt('Enter new email', record.data?.email || '')
                    const customField = prompt('Enter new custom field', record.data?.customField || '')
                    if (name !== null && email !== null) {
                      handleUpdateRecord(record.id, { name, email, customField })
                    }
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRecord(record.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Records