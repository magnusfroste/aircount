import React from 'react'
import BalanceSheet from '../components/BalanceSheet'

const BalanceSheetPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Balance Sheet</h1>
        <BalanceSheet />
      </div>
    </div>
  )
}

export default BalanceSheetPage