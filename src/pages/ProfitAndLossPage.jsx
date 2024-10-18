import React from 'react'
import ProfitAndLoss from '../components/ProfitAndLoss'
import Header from '../components/Header'

const ProfitAndLossPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profit and Loss</h1>
        <ProfitAndLoss />
      </div>
    </div>
  )
}

export default ProfitAndLossPage