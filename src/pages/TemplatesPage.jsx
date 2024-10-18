import React, { useState, useMemo } from 'react'
import { useTemplates } from '../integrations/supabase/hooks/templates'
import { useAddTransaction } from '../integrations/supabase/hooks/transactions'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { format } from 'date-fns'

const SelectedTransactions = ({ selectedTemplates, templates, accounts, transactionDate, onAddTransactions, editedTransactions, setEditedTransactions, accountBalances }) => {
  const selectedTransactionTemplates = templates.filter(template => selectedTemplates.includes(template.id))

  const handleEdit = (id, field, value) => {
    setEditedTransactions(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: parseFloat(value) || 0 }
    }))
  }

  const sums = useMemo(() => {
    return selectedTransactionTemplates.reduce((acc, template) => {
      const editedTransaction = editedTransactions[template.id] || {}
      acc.debit += editedTransaction.debit ?? template.debit
      acc.credit += editedTransaction.credit ?? template.credit
      return acc
    }, { debit: 0, credit: 0 })
  }, [selectedTransactionTemplates, editedTransactions])

  const difference = sums.debit - sums.credit

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
            onClick={() => onAddTransactions(transactionDate, editedTransactions)}
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
                <TableHead>Current Balance</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTransactionTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.account_number} - {accounts.find(acc => acc.account === template.account_number)?.account_name || 'Unknown Account'}</TableCell>
                  <TableCell>{accountBalances[template.account_number]?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editedTransactions[template.id]?.debit ?? template.debit}
                      onChange={(e) => handleEdit(template.id, 'debit', e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editedTransactions[template.id]?.credit ?? template.credit}
                      onChange={(e) => handleEdit(template.id, 'credit', e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell>{sums.debit.toFixed(2)}</TableCell>
                <TableCell>{sums.credit.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className={difference === 0 ? "text-green-600" : "text-red-600"}>
                <TableCell colSpan={4}>Difference (Debit - Credit)</TableCell>
                <TableCell>{difference.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p>No transactions selected</p>
        )}
      </CardContent>
    </Card>
  )
}

const AvailableTemplates = ({ templates, accounts, selectedTemplates, handleTemplateSelect, searchTerm }) => {
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
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
            {filteredTemplates.map((template) => (
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
  )
}

const TemplatesPage = () => {
  const { session } = useSupabaseAuth()
  const { data: templates, isLoading: templatesLoading, error: templatesError } = useTemplates()
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id)
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id)
  const addTransactionMutation = useAddTransaction()
  const [selectedTemplates, setSelectedTemplates] = useState([])
  const [transactionDate, setTransactionDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [currentVer, setCurrentVer] = useState(1)
  const [editedTransactions, setEditedTransactions] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const accountBalances = useMemo(() => {
    if (!transactions) return {}
    return transactions.reduce((acc, transaction) => {
      acc[transaction.account] = (acc[transaction.account] || 0) + transaction.debit - transaction.credit
      return acc
    }, {})
  }, [transactions])

  if (templatesLoading || accountsLoading || transactionsLoading) return <div>Loading data...</div>
  if (templatesError || accountsError || transactionsError) return <div>Error loading data</div>

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  const handleAddSelectedTransactions = (date, editedTransactions) => {
    if (!date) {
      toast.error('Please select a date for the transactions')
      return
    }

    const selectedTransactions = templates
      .filter(template => selectedTemplates.includes(template.id))
      .map(template => ({
        date: date,
        account: template.account_number,
        debit: editedTransactions[template.id]?.debit ?? template.debit,
        credit: editedTransactions[template.id]?.credit ?? template.credit,
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
        setEditedTransactions({})
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
        editedTransactions={editedTransactions}
        setEditedTransactions={setEditedTransactions}
        accountBalances={accountBalances}
      />

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <AvailableTemplates 
        templates={templates}
        accounts={accounts}
        selectedTemplates={selectedTemplates}
        handleTemplateSelect={handleTemplateSelect}
        searchTerm={searchTerm}
      />
    </div>
  )
}

export default TemplatesPage