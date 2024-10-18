import React from 'react'
import Accounts from '../components/Accounts'

const AccountsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Accounts</h1>
        <Accounts />
      </div>
    </div>
  )
}

export default AccountsPage