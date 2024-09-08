import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, DollarSign, Smile, PieChart } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">Welcome to AirAccounter</h1>
        <p className="text-xl text-center mt-2 text-gray-600">Your free, donation-powered financial companion</p>
      </header>

      <main className="container mx-auto mt-12">
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Take Control of Your Finances</h2>
            <ul className="space-y-4">
              {[
                "Easy-to-use accounting software",
                "Comprehensive financial reports",
                "Secure and privacy-focused",
                "Always free, powered by donations"
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/login">
              <Button className="mt-6">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <img
              src="/dashboard-mockup.jpg"
              alt="AirAccounter Dashboard"
              className="rounded-lg shadow-xl"
            />
            <img
              src="/happy-user.jpg"
              alt="Happy AirAccounter User"
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-3xl font-semibold text-center mb-12">Why Choose AirAccounter?</h2>
          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 text-center">
          <h2 className="text-3xl font-semibold mb-4">Join Thousands of Happy Users</h2>
          <p className="text-xl text-gray-600 mb-8">Experience the joy of having complete control over your finances</p>
          <div className="flex justify-center space-x-4">
            <img src="/user-testimonial-1.jpg" alt="Happy User 1" className="w-16 h-16 rounded-full" />
            <img src="/user-testimonial-2.jpg" alt="Happy User 2" className="w-16 h-16 rounded-full" />
            <img src="/user-testimonial-3.jpg" alt="Happy User 3" className="w-16 h-16 rounded-full" />
          </div>
          <Link to="/login">
            <Button className="mt-8">
              Start Your Financial Journey <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="mt-24 bg-blue-600 text-white py-8">
        <div className="container mx-auto text-center">
          <p>AirAccounter - Empowering Your Financial Future</p>
          <p className="mt-2">Powered by donations from users like you</p>
          <Button variant="outline" className="mt-4">
            Support AirAccounter
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage