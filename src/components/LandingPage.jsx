import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, DollarSign, Smile, PieChart } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Welcome to Aircout</h2>
          <p className="text-xl text-gray-600 mb-8">Your free, donation-powered financial companion</p>
          <Link to="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
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

        <section id="testimonials" className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Alex", comment: "AirAccounter simplified my business finances!" },
              { name: "Sarah", comment: "I love how easy it is to track my expenses now." },
              { name: "Mike", comment: "The reports are clear and help me make better decisions." }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of satisfied users today</p>
          <Link to="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Your Financial Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-2">Aircounter - Empowering Your Financial Future</p>
          <p className="mb-4">Powered by donations from users like you</p>
          <Button variant="outline" className="text-white border-blue hover:bg-grey hover:text-gray-800">
            Support Aircounter
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
