import React, { useState } from 'react'
import { useTemplates, useAddTemplate, useDeleteTemplate } from '../integrations/supabase/hooks/templates'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'

const TemplatePage = () => {
  const { session } = useSupabaseAuth()
  const { data: templates, isLoading, error } = useTemplates(session?.user?.id)
  const { data: accounts } = useAccounts(session?.user?.id)
  const addTemplateMutation = useAddTemplate()
  const deleteTemplateMutation = useDeleteTemplate()

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    transactions: [{ account: '', debit: 0, credit: 0 }]
  })

  const handleAddTransaction = () => {
    setNewTemplate(prev => ({
      ...prev,
      transactions: [...prev.transactions, { account: '', debit: 0, credit: 0 }]
    }))
  }

  const handleTransactionChange = (index, field, value) => {
    setNewTemplate(prev => {
      const newTransactions = [...prev.transactions]
      newTransactions[index] = { ...newTransactions[index], [field]: value }
      return { ...prev, transactions: newTransactions }
    })
  }

  const handleSubmit = () => {
    if (!newTemplate.name) {
      toast.error('Template name is required')
      return
    }
    addTemplateMutation.mutate({ ...newTemplate, user_id: session.user.id }, {
      onSuccess: () => {
        toast.success('Template added successfully')
        setNewTemplate({ name: '', description: '', transactions: [{ account: '', debit: 0, credit: 0 }] })
      },
      onError: (error) => {
        toast.error(`Error adding template: ${error.message}`)
      }
    })
  }

  const handleDelete = (id) => {
    deleteTemplateMutation.mutate({ id, user_id: session.user.id }, {
      onSuccess: () => toast.success('Template deleted successfully'),
      onError: (error) => toast.error(`Error deleting template: ${error.message}`)
    })
  }

  if (isLoading) return <div>Loading templates...</div>
  if (error) return <div>Error loading templates: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Accounting Templates</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Description"
            value={newTemplate.description}
            onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
            className="mb-2"
          />
          {newTemplate.transactions.map((transaction, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Select
                value={transaction.account}
                onValueChange={(value) => handleTransactionChange(index, 'account', value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.account}>
                      {account.account} - {account.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Debit"
                value={transaction.debit}
                onChange={(e) => handleTransactionChange(index, 'debit', parseFloat(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Credit"
                value={transaction.credit}
                onChange={(e) => handleTransactionChange(index, 'credit', parseFloat(e.target.value))}
              />
            </div>
          ))}
          <Button onClick={handleAddTransaction} className="mr-2">Add Transaction</Button>
          <Button onClick={handleSubmit}>Create Template</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{template.description}</p>
              {template.transactions.map((transaction, index) => (
                <div key={index} className="mb-1">
                  <span>{transaction.account}: </span>
                  <span className="text-green-600">{transaction.debit > 0 ? transaction.debit : ''}</span>
                  <span className="text-red-600">{transaction.credit > 0 ? transaction.credit : ''}</span>
                </div>
              ))}
              {!template.is_admin_template && (
                <Button onClick={() => handleDelete(template.id)} variant="destructive" className="mt-2">
                  Delete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TemplatePage