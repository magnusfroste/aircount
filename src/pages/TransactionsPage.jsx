import React from 'react'
import Transactions from '../components/Transactions'
import Header from '../components/Header'

const TransactionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        <Transactions />
      </div>
    </div>
  )
}

export default TransactionsPage