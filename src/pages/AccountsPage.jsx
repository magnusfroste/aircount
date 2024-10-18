import React from 'react'
import Accounts from '../components/Accounts'
import Header from '../components/Header'

const AccountsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto p-4">
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-md p-6">
          <Accounts />
        </div>
      </div>
    </div>
  )
}

export default AccountsPage