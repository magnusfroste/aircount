import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAddTransaction } from '../integrations/supabase/hooks/transactions';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import OpenAI from 'openai';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const AutoPage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const { session } = useSupabaseAuth();
  const addTransactionMutation = useAddTransaction();

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        toast.error('Image size must be less than 20MB');
        return;
      }
      setImage(file);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extract the base64 data without the data URL prefix
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processImage = async () => {
    if (!image) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const base64Image = await convertToBase64(image);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Extract all transactions from this bank statement image and return ONLY a JSON array with this exact structure, nothing else: [{date: 'YYYY-MM-DD', description: 'string', amount: number}]. Amounts should be positive for credits and negative for debits. Do not include any explanatory text, only the JSON array." 
              },
              { 
                type: "image_url",
                image_url: {
                  url: `data:image/${image.type};base64,${base64Image}`
                }
              }
            ],
          },
        ],
        max_tokens: 4096,
      });

      try {
        const extractedData = JSON.parse(response.choices[0].message.content.trim());
        setTransactions(extractedData);
        toast.success('Transactions extracted successfully');
      } catch (parseError) {
        console.error('JSON Parse Error:', response.choices[0].message.content);
        toast.error('Failed to parse the extracted data. Please try again.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSelect = (index) => {
    setSelectedTransactions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const importSelectedTransactions = async () => {
    try {
      const transactionsToImport = selectedTransactions.map(index => {
        const t = transactions[index];
        return {
          date: t.date,
          ver: new Date().getTime().toString(),
          account: '1930', // Default bank account
          debit: t.amount < 0 ? Math.abs(t.amount) : 0,
          credit: t.amount > 0 ? t.amount : 0,
          user_id: session.user.id
        };
      });

      await addTransactionMutation.mutateAsync(transactionsToImport);
      toast.success('Transactions imported successfully');
      setSelectedTransactions([]);
    } catch (error) {
      console.error('Error importing transactions:', error);
      toast.error('Failed to import transactions');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Auto Import from Bank Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <Button 
              onClick={processImage} 
              disabled={!image || loading}
            >
              {loading ? 'Processing...' : 'Process Image'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTransactions.includes(index)}
                        onCheckedChange={() => handleTransactionSelect(index)}
                      />
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      {transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button
                onClick={importSelectedTransactions}
                disabled={selectedTransactions.length === 0}
              >
                Import Selected Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

};

export default AutoPage;