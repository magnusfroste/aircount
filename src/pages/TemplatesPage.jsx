import React, { useState } from 'react'
import { useTemplates } from '../integrations/supabase/hooks/templates'
import { useAddTransaction } from '../integrations/supabase/hooks/transactions'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { format } from 'date-fns'

const SelectedTransactions = ({ selectedTemplates, templates, accounts, transactionDate, onAddTransactions }) => {
  const selectedTransactionTemplates = templates.filter(template => selectedTemplates.includes(template.id))

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Selected Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Input
            type="date"
            value={transactionDate}
            onChange={(e) => onAddTransactions(e.target.value)}
            className="w-48"
          />
          <Button 
            onClick={() => onAddTransactions(transactionDate)}
            disabled={selectedTemplates.length === 0}
          >
            Add Selected Transactions
          </Button>
        </div>
        {selectedTransactionTemplates.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTransactionTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.account_number} - {accounts.find(acc => acc.account === template.account_number)?.account_name || 'Unknown Account'}</TableCell>
                  <TableCell>{template.debit}</TableCell>
                  <TableCell>{template.credit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No transactions selected</p>
        )}
      </CardContent>
    </Card>
  )
}

const TemplatesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: templates, isLoading: templatesLoading, error: templatesError } = useTemplates()
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  const addTransactionMutation = useAddTransaction()
  const [selectedTemplates, setSelectedTemplates] = useState([])
  const [transactionDate, setTransactionDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [currentVer, setCurrentVer] = useState(1)

  if (templatesLoading || accountsLoading) return <div>Loading templates and accounts...</div>
  if (templatesError) return <div>Error loading templates: {templatesError.message}</div>
  if (accountsError) return <div>Error loading accounts: {accountsError.message}</div>

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  const handleAddSelectedTransactions = (date) => {
    if (!date) {
      toast.error('Please select a date for the transactions')
      return
    }

    const selectedTransactions = templates
      .filter(template => selectedTemplates.includes(template.id))
      .map(template => ({
        date: date,
        account: template.account_number,
        debit: template.debit,
        credit: template.credit,
        ver: currentVer.toString(),
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
        setCurrentVer(prev => prev + 1)
      },
      onError: (error) => {
        toast.error(`Error adding transactions: ${error.message}`)
      }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Templates</h1>
      
      <SelectedTransactions 
        selectedTemplates={selectedTemplates}
        templates={templates}
        accounts={accounts}
        transactionDate={transactionDate}
        onAddTransactions={handleAddSelectedTransactions}
      />

      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Account</TableHead>
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
                  <TableCell>{template.account_number} - {accounts.find(acc => acc.account === template.account_number)?.account_name || 'Unknown Account'}</TableCell>
                  <TableCell>{template.debit}</TableCell>
                  <TableCell>{template.credit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default TemplatesPage