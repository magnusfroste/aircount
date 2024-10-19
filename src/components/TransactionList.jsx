import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from 'lucide-react'
import { format } from 'date-fns'

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const TransactionRow = ({ transaction, handleDeleteTransaction, accountName }) => (
  <TableRow key={transaction.id}>
    <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
    <TableCell>{transaction.account} - {accountName}</TableCell>
    <TableCell>{formatNumber(transaction.debit.toFixed(2))}</TableCell>
    <TableCell>{formatNumber(transaction.credit.toFixed(2))}</TableCell>
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

const TransactionList = ({ groupedTransactions, handleDeleteTransaction, accountMap }) => (
  <>
    {Object.entries(groupedTransactions).map(([ver, transactions]) => (
      <Card key={ver} className="mb-6">
        <CardHeader>
          <CardTitle>Transaction Number: {ver}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  handleDeleteTransaction={handleDeleteTransaction}
                  accountName={accountMap[transaction.account] || 'Unknown Account'}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    ))}
  </>
)

export default TransactionList