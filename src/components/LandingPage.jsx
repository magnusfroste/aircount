import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, DollarSign, Smile, PieChart } from 'lucide-react'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const LandingPage = () => {
  const { session } = useSupabaseAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Welcome to Aircount</h2>
          <p className="text-xl text-gray-600 mb-8">Your free, donation-powered financial companion</p>
          {!session ? (
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign In <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </section>

        <section id="features" className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <DollarSign className="w-12 h-12 text-blue-500" />,
              title: "Financial Clarity",
              description: "Gain insights into your financial health with easy-to-understand reports and visualizations."
            },
            {
              icon: <Smile className="w-12 h-12 text-yellow-500" />,
              title: "Stress-Free Accounting",
              description: "Say goodbye to accounting headaches with our user-friendly interface and automated features."
            },
            {
              icon: <PieChart className="w-12 h-12 text-green-500" />,
              title: "Growth-Focused",
              description: "Make informed decisions to grow your business or personal wealth with data-driven insights."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default LandingPage