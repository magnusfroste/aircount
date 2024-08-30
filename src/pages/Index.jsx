import AirtableInterface from '../components/AirtableInterface'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Button } from '@/components/ui/button'

const Index = () => {
  const { logout } = useSupabaseAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Button onClick={logout}>Logout</Button>
        </div>
        <AirtableInterface />
      </div>
    </div>
  )
}

export default Index
