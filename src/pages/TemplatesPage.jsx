import React, { useState } from 'react'
import { useTemplates } from '../integrations/supabase/hooks/templates'
import { useAddTransaction } from '../integrations/supabase/hooks/transactions'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useTransactions } from '../integrations/supabase/hooks/transactions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import AvailableTemplates from '../components/AvailableTemplates'
import SelectedTransactions from '../components/SelectedTransactions'

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

  const accountBalances = React.useMemo(() => {
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

      <AvailableTemplates 
        templates={templates}
        accounts={accounts}
        selectedTemplates={selectedTemplates}
        handleTemplateSelect={handleTemplateSelect}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  )
}

export default TemplatesPage
