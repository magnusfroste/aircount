import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { useAddTransaction } from '../integrations/supabase/hooks/transactions';
import { toast } from "sonner";
import TransactionPreview from '../components/TransactionPreview';
import TransactionForm from '../components/TransactionForm';
import { useAccounts } from '../integrations/supabase/hooks/accounts';

const ImportSebPage = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const { session } = useSupabaseAuth();
  const addTransactionMutation = useAddTransaction();
  const { data: accounts } = useAccounts(session?.user?.id);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').slice(1); // Skip header row
        const parsedData = rows
          .filter(row => row.trim()) // Remove empty rows
          .map(row => {
            const [bokford, valutadatum, text, typ, insattningar, uttag, saldo] = row.split(',');
            let amount = 0;
            if (insattningar && insattningar.trim()) {
              amount = parseFloat(insattningar);
            } else if (uttag && uttag.trim()) {
              amount = -parseFloat(uttag);
            }
            return {
              date: valutadatum,
              description: text,
              amount: amount,
              type: typ,
              balance: parseFloat(saldo || '0'),
            };
          });
        setCsvData(parsedData);
      };
      reader.readAsText(file);
    }
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  const handleConfirmTransaction = async (transactions, verNumber) => {
    try {
      const transactionsWithUser = transactions.map(transaction => ({
        ...transaction,
        user_id: session.user.id,
        ver: verNumber.toString(),
      }));

      await addTransactionMutation.mutateAsync(transactionsWithUser);
      toast.success('Transactions added successfully');
      setSelectedRow(null);
    } catch (error) {
      toast.error('Failed to add transactions: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Import SEB Bank Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mb-4"
          />
          {csvData.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRow === row}
                        onCheckedChange={() => handleRowSelect(row)}
                      />
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell className="text-right">{row.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{row.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedRow && (
        <TransactionPreview
          bankTransaction={selectedRow}
          onConfirm={handleConfirmTransaction}
          onCancel={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
};

export default ImportSebPage;