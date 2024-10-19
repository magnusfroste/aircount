import React from 'react'
import Transactions from '../components/Transactions'

const TransactionsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <Transactions />
    </div>
  )
}

export default TransactionsPage