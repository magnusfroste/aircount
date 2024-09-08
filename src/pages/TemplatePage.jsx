import React, { useState, useEffect } from 'react'
import { useTemplates, useAddTemplate, useUpdateTemplate, useDeleteTemplate } from '../integrations/supabase/hooks/templates'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from 'date-fns'
import { toast } from 'sonner'

const TemplatePage = () => {
  const { session } = useSupabaseAuth()
  const { data: templates, isLoading: templatesLoading, error: templatesError } = useTemplates(session?.user?.id)
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  const addTemplateMutation = useAddTemplate()
  const updateTemplateMutation = useUpdateTemplate()
  const deleteTemplateMutation = useDeleteTemplate()
  const [newTemplate, setNewTemplate] = useState({ name: '', date: format(new Date(), 'yyyy-MM-dd'), account: '', debit: 0, credit: 0 })

  useEffect(() => {
    console.log('Accounts data:', accounts)
  }, [accounts])

  if (templatesLoading || accountsLoading) return <div>Loading templates and accounts...</div>
  if (templatesError) return <div>Error loading templates: {templatesError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.account) {
      toast.error('Please fill in all required fields')
      return
    }
    addTemplateMutation.mutate({ ...newTemplate, user_id: session.user.id }, {
      onSuccess: () => {
        toast.success('Template added successfully')
        setNewTemplate({ name: '', date: format(new Date(), 'yyyy-MM-dd'), account: '', debit: 0, credit: 0 })
      },
      onError: (error) => {
        toast.error(`Error adding template: ${error.message}`)
      }
    })
  }

  const handleUpdateTemplate = (id, updateData) => {
    updateTemplateMutation.mutate({ id, user_id: session.user.id, ...updateData }, {
      onSuccess: () => {
        toast.success('Template updated successfully')
      },
      onError: (error) => {
        toast.error(`Error updating template: ${error.message}`)
      }
    })
  }

  const handleDeleteTemplate = (id) => {
    deleteTemplateMutation.mutate({ id, user_id: session.user.id }, {
      onSuccess: () => {
        toast.success('Template deleted successfully')
      },
      onError: (error) => {
        toast.error(`Error deleting template: ${error.message}`)
      }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Accounting Templates</h1>
      <div className="mb-4 grid grid-cols-6 gap-2">
        <Input
          placeholder="Template Name"
          value={newTemplate.name}
          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
        />
        <Input
          type="date"
          value={newTemplate.date}
          onChange={(e) => setNewTemplate({ ...newTemplate, date: e.target.value })}
        />
        <Select
          value={newTemplate.account}
          onValueChange={(value) => setNewTemplate({ ...newTemplate, account: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts && accounts.length > 0 ? (
              accounts.map((account) => (
                <SelectItem key={account.id} value={account.account || 'default'}>
                  {account.account} - {account.account_name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-accounts">No accounts available</SelectItem>
            )}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Debit"
          value={newTemplate.debit}
          onChange={(e) => setNewTemplate({ ...newTemplate, debit: parseFloat(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Credit"
          value={newTemplate.credit}
          onChange={(e) => setNewTemplate({ ...newTemplate, credit: parseFloat(e.target.value) })}
        />
        <Button onClick={handleAddTemplate}>Add Template</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Template Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates && templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{template.name}</TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={template.date}
                  onChange={(e) => handleUpdateTemplate(template.id, { date: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={template.account || 'default'}
                  onValueChange={(value) => handleUpdateTemplate(template.id, { account: value })}
                >
                  <SelectTrigger>
                    <SelectValue>{template.account || 'Select account'}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {accounts && accounts.length > 0 ? (
                      accounts.map((account) => (
                        <SelectItem key={account.id} value={account.account || 'default'}>
                          {account.account} - {account.account_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-accounts">No accounts available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={template.debit}
                  onChange={(e) => handleUpdateTemplate(template.id, { debit: parseFloat(e.target.value) })}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={template.credit}
                  onChange={(e) => handleUpdateTemplate(template.id, { credit: parseFloat(e.target.value) })}
                />
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteTemplate(template.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default TemplatePage