import React from 'react'
import Transactions from '../components/Transactions'

const TransactionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <Transactions />
      </div>
    </div>
  )
}

export default TransactionsPage