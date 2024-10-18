import React from 'react'
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'

const TransactionRow = ({ transaction, handleDeleteTransaction, accountNumber, accountName }) => (
  <TableRow key={transaction.id}>
    <TableCell>{format(parseISO(transaction.date), 'yyyy-MM-dd')}</TableCell>
    <TableCell>{accountNumber}</TableCell>
    <TableCell>{accountName}</TableCell>
    <TableCell>{transaction.debit}</TableCell>
    <TableCell>{transaction.credit}</TableCell>
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
)

export default TransactionRow