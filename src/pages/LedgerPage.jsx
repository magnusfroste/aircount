import React from 'react'
import Ledger from '../components/Ledger'
import Header from '../components/Header'

const LedgerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ledger</h1>
        <Ledger />
      </div>
    </div>
  )
}

export default LedgerPage