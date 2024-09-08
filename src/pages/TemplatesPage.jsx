import React, { useState } from 'react'
import { useTemplates, useAddTransaction } from '../integrations/supabase/hooks/templates'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { format } from 'date-fns'

const TemplatesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: templates, isLoading, error } = useTemplates()
  const addTransactionMutation = useAddTransaction()
  const [selectedTemplates, setSelectedTemplates] = useState([])
  const [transactionDate, setTransactionDate] = useState(format(new Date(), 'yyyy-MM-dd'))

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
    if (!transactionDate) {
      toast.error('Please select a date for the transactions')
      return
    }

    const selectedTransactions = templates
      .filter(template => selectedTemplates.includes(template.id))
      .map(template => ({
        date: transactionDate,
        account: template.account_number,
        debit: template.debit,
        credit: template.credit,
        ver: template.name,
        user_id: session.user.id
      }))

    if (selectedTransactions.length === 0) {
      toast.error('Please select at least one template')
      return
    }

    addTransactionMutation.mutate(selectedTransactions, {
      onSuccess: () => {
        toast.success(`Added ${selectedTransactions.length} transaction(s)`)
        setSelectedTemplates([])
      },
      onError: (error) => {
        toast.error(`Error adding transactions: ${error.message}`)
      }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Templates</h1>
      <div className="mb-4">
        <Input
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className="w-48"
        />
      </div>
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