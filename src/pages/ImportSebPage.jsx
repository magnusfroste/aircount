import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { useAddTransaction } from '../integrations/supabase/hooks/transactions';
import { toast } from "sonner";

const ImportSebPage = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { session } = useSupabaseAuth();
  const addTransactionMutation = useAddTransaction();

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
            return {
              date: valutadatum,
              description: text,
              debit: parseFloat(uttag || '0'),
              credit: parseFloat(insattningar || '0'),
              user_id: session.user.id,
              account: '1930', // Bank account number
            };
          });
        setCsvData(parsedData);
      };
      reader.readAsText(file);
    }
  };

  const handleRowSelect = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleImportSelected = async () => {
    try {
      const selectedTransactions = selectedRows.map(index => csvData[index]);
      for (const transaction of selectedTransactions) {
        await addTransactionMutation.mutateAsync(transaction);
      }
      toast.success(`Successfully imported ${selectedTransactions.length} transactions`);
      setSelectedRows([]);
    } catch (error) {
      toast.error('Failed to import transactions: ' + error.message);
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
            <>
              <div className="flex justify-between items-center mb-4">
                <span>{selectedRows.length} rows selected</span>
                <Button 
                  onClick={handleImportSelected}
                  disabled={selectedRows.length === 0}
                >
                  Import Selected
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Deposits</TableHead>
                    <TableHead className="text-right">Withdrawals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(index)}
                          onCheckedChange={() => handleRowSelect(index)}
                        />
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell className="text-right">{row.credit.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{row.debit.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportSebPage;