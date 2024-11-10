import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

const BankTransactionDetails = ({ bankTransaction }) => {
  if (!bankTransaction) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Original Bank Transaction:</h3>
      <p>Date: {bankTransaction.date}</p>
      <p>Description: {bankTransaction.description}</p>
      <p>Amount: {bankTransaction.amount}</p>
    </div>
  );
};

export default BankTransactionDetails;