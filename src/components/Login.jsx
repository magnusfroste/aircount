import React, { useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseAuth } from '../integrations/supabase/auth'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner'

const Login = () => {
  const { session } = useSupabaseAuth()
  const [view, setView] = useState('sign-in')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (session) {
    return <Navigate to="/" replace />
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Insert company data
      const { error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            id: data.user.id,
            company_name: companyName,
          },
        ])

      if (companyError) throw companyError

      toast.success('Check your email for the confirmation link!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {view === 'sign-in' ? 'Login' : 'Sign Up'}
        </h1>

        {view === 'sign-up' ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>
            <p className="text-center text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setView('sign-in')}
                className="text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-center text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setView('sign-up')}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login