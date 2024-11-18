import React from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Check, X, Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import { formatNumber } from '../utils/formatUtils'

const OpeningBalanceTable = ({ 
  accounts, 
  groupedBalances, 
  editingId, 
  editValues, 
  setEditValues, 
  handleStartEdit, 
  handleSaveEdit, 
  handleCancelEdit, 
  handleDeleteBalance,
  sortOrder,
  setSortOrder,
  totals 
}) => {
  const sortedBalances = [...groupedBalances].sort((a, b) => {
    if (sortOrder === 'debit-asc') return a.debit - b.debit
    if (sortOrder === 'debit-desc') return b.debit - a.debit
    if (sortOrder === 'credit-asc') return a.credit - b.credit
    if (sortOrder === 'credit-desc') return b.credit - a.credit
    return 0
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead className="text-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(
                sortOrder === 'debit-asc' ? 'debit-desc' : 'debit-asc'
              )}
            >
              Debit
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="text-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(
                sortOrder === 'credit-asc' ? 'credit-desc' : 'credit-asc'
              )}
            >
              Credit
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedBalances.map((balance) => {
          const account = accounts?.find(a => a.account === balance.account)
          return (
            <TableRow key={balance.id}>
              <TableCell>{balance.account}</TableCell>
              <TableCell>{account ? account.account_name : 'Unknown'}</TableCell>
              <TableCell className="text-right">
                {editingId === balance.id ? (
                  <Input
                    type="number"
                    value={editValues.debit}
                    onChange={(e) => setEditValues({ ...editValues, debit: parseFloat(e.target.value) || 0 })}
                    className="w-24 text-right"
                  />
                ) : (
                  formatNumber(balance.debit)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === balance.id ? (
                  <Input
                    type="number"
                    value={editValues.credit}
                    onChange={(e) => setEditValues({ ...editValues, credit: parseFloat(e.target.value) || 0 })}
                    className="w-24 text-right"
                  />
                ) : (
                  formatNumber(balance.credit)
                )}
              </TableCell>
              <TableCell>
                {editingId === balance.id ? (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSaveEdit(balance.id)}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(balance)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBalance(balance.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )
        })}
        <TableRow className="font-bold">
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">{formatNumber(totals.debit)}</TableCell>
          <TableCell className="text-right">{formatNumber(totals.credit)}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default OpeningBalanceTable