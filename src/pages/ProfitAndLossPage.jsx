import React from 'react'
import ProfitAndLoss from '../components/ProfitAndLoss'

const ProfitAndLossPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profit and Loss Statement</h1>
        <ProfitAndLoss />
      </div>
    </div>
  )
}

export default ProfitAndLossPage