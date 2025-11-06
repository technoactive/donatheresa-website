import Link from 'next/link'
import { Metadata } from 'next'
import { Home, Settings, Calendar, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 - Dashboard Page Not Found | Dona Theresa',
  description: 'The dashboard page you are looking for could not be found.',
  robots: 'noindex, follow',
}

export default function DashboardNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Dashboard Page Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            The dashboard page you're looking for doesn't exist or you don't have permission to access it.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Home className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="font-semibold">Dashboard Home</h3>
              <p className="text-sm text-gray-600">Return to main dashboard</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Calendar className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="font-semibold">Bookings</h3>
              <p className="text-sm text-gray-600">View all reservations</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Settings className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="font-semibold">Settings</h3>
              <p className="text-sm text-gray-600">Manage configurations</p>
            </div>
          </Link>
          
          <Link
            href="/"
            className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Home className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="font-semibold">Main Website</h3>
              <p className="text-sm text-gray-600">Visit public site</p>
            </div>
          </Link>
        </div>

        {/* Support Message */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Need help? Contact your administrator.</p>
        </div>
      </div>
    </div>
  )
}
