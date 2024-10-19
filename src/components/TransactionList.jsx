import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { format } from 'date-fns'

const TransactionList = ({ transactions, handleDeleteTransaction, accountMap }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Account</TableHead>
          <TableHead className="text-right">Debit</TableHead>
          <TableHead className="text-right">Credit</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
            <TableCell>{transaction.account} - {accountMap[transaction.account] || 'Unknown Account'}</TableCell>
            <TableCell className="text-right">{transaction.debit.toFixed(2)}</TableCell>
            <TableCell className="text-right">{transaction.credit.toFixed(2)}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteTransaction(transaction.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TransactionList