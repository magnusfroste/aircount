import React from 'react'
import BalanceSheet from '../components/BalanceSheet'
import Header from '../components/Header'

const BalanceSheetPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto p-4">
        <BalanceSheet />
      </div>
    </div>
  )
}

export default BalanceSheetPage