import React, { useState } from 'react'
import { useTemplates, useAddTransaction } from '../integrations/supabase/hooks/templates'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

const TemplatesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: templates, isLoading, error } = useTemplates()
  const addTransactionMutation = useAddTransaction()
  const [selectedTemplates, setSelectedTemplates] = useState([])

  if (isLoading) return <div>Loading templates...</div>
  if (error) return <div>Error loading templates: {error.message}</div>

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  const handleAddSelectedTransactions = () => {
    const selectedTransactions = templates.filter(template => selectedTemplates.includes(template.id))
    selectedTransactions.forEach(template => {
      addTransactionMutation.mutate({
        date: new Date().toISOString().split('T')[0],
        account: template.account_number,
        debit: template.debit,
        credit: template.credit,
        ver: template.name,
        user_id: session.user.id
      }, {
        onSuccess: () => {
          toast.success(`Added transaction: ${template.name}`)
        },
        onError: (error) => {
          toast.error(`Error adding transaction: ${error.message}`)
        }
      })
    })
    setSelectedTemplates([])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Templates</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Account Number</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedTemplates.includes(template.id)}
                  onChange={() => handleTemplateSelect(template.id)}
                />
              </TableCell>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.account_number}</TableCell>
              <TableCell>{template.debit}</TableCell>
              <TableCell>{template.credit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button 
        onClick={handleAddSelectedTransactions}
        disabled={selectedTemplates.length === 0}
        className="mt-4"
      >
        Add Selected Transactions
      </Button>
    </div>
  )
}

export default TemplatesPage