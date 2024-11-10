import React from 'react'
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useAccounts } from '../integrations/supabase/hooks/accounts'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const TransactionRows = ({ allTransactions, doubleEntryTransactions, handleUpdateCustomRow, matchingTemplate, bankTransaction }) => {
  const { session } = useSupabaseAuth()
  const { data: accounts } = useAccounts(session?.user?.id)

  const getAccountName = (accountNumber) => {
    const account = accounts?.find(acc => acc.account === accountNumber)
    return account?.account_name || accountNumber
  }

  return (
    <TableBody>
      {allTransactions.map((transaction, index) => (
        <TableRow key={index}>
          <TableCell>
            {index >= doubleEntryTransactions.length ? (
              <Input
                type="text"
                value={transaction.account}
                onChange={(e) => handleUpdateCustomRow(index - doubleEntryTransactions.length, 'account', e.target.value)}
              />
            ) : (
              transaction.account
            )}
          </TableCell>
          <TableCell>
            {index >= doubleEntryTransactions.length ? (
              bankTransaction?.description
            ) : (
              getAccountName(transaction.account)
            )}
          </TableCell>
          <TableCell>
            {index >= doubleEntryTransactions.length ? (
              <Input
                type="number"
                value={transaction.debit}
                onChange={(e) => handleUpdateCustomRow(index - doubleEntryTransactions.length, 'debit', e.target.value)}
              />
            ) : (
              transaction.debit
            )}
          </TableCell>
          <TableCell>
            {index >= doubleEntryTransactions.length ? (
              <Input
                type="number"
                value={transaction.credit}
                onChange={(e) => handleUpdateCustomRow(index - doubleEntryTransactions.length, 'credit', e.target.value)}
              />
            ) : (
              transaction.credit
            )}
          </TableCell>
          <TableCell>{transaction.date}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export default TransactionRows