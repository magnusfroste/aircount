import React, { useState, useEffect, useMemo } from 'react'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { supabase } from '../lib/supabase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const SearchableAccountSelect = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [accounts, setAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { session } = useSupabaseAuth()

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('accounts')
        .select('account, account_name')
        .eq('user_id', session.user.id)
        .order('account', { ascending: true })

      if (error) {
        console.error('Error fetching accounts:', error)
      } else {
        setAccounts(data)
      }
      setIsLoading(false)
    }

    fetchAccounts()
  }, [session.user.id])

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => 
      account.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.account_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [accounts, searchTerm])

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search accounts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      {isLoading ? (
        <div className="mt-2">Loading...</div>
      ) : (
        <ScrollArea className="h-[200px] w-full border rounded-md mt-2">
          {filteredAccounts.slice(0, 100).map((account) => (
            <Button
              key={account.account}
              variant={value === account.account ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onChange(account.account)}
            >
              {account.account} - {account.account_name}
            </Button>
          ))}
          {filteredAccounts.length > 100 && (
            <div className="p-2 text-sm text-gray-500">
              Showing 100 of {filteredAccounts.length} results. Please refine your search.
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}

export default SearchableAccountSelect