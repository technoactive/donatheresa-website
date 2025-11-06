import Link from 'next/link'
import { Metadata } from 'next'
import { Search, Home, MapPin, Phone, Clock, ChefHat, Calendar, Mail } from 'lucide-react'
import { NotFoundTracker } from '@/components/not-found-tracker'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Dona Theresa Italian Restaurant',
  description: 'The page you are looking for could not be found. Browse our menu, make a reservation, or contact us.',
  robots: 'noindex, follow',
}

export default function NotFound() {
  return (
    <>
      <NotFoundTracker />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* 404 Display */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-gray-100 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl md:text-8xl animate-bounce">🍝</div>
            </div>
          </div>
          
          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! This Page Got Lost in the Kitchen
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Like a perfect recipe, sometimes pages go missing. Don't worry, we'll help you find what you're looking for.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <form action="/search" method="get" className="relative">
            <input
              type="search"
              name="q"
              placeholder="Search for menu items, reservations..."
              className="w-full px-12 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:border-amber-500 transition-colors placeholder:text-gray-400"
              autoComplete="off"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Home */}
          <Link
            href="/"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Home className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 mb-1">Homepage</h3>
            <p className="text-sm text-gray-600">Return to our main page</p>
          </Link>

          {/* Menu */}
          <Link
            href="/menu"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <ChefHat className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 mb-1">Our Menu</h3>
            <p className="text-sm text-gray-600">Explore our Italian dishes</p>
          </Link>

          {/* Reservations */}
          <Link
            href="/reserve"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <Calendar className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 mb-1">Reservations</h3>
            <p className="text-sm text-gray-600">Book your table online</p>
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <Phone className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 mb-1">Contact Us</h3>
            <p className="text-sm text-gray-600">Get in touch with us</p>
          </Link>
        </div>

        {/* Popular Pages Section */}
        <div className="bg-amber-50 rounded-2xl p-8 mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Menus</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/menu/lunchtime-earlybird" className="text-amber-600 hover:text-amber-700 transition-colors">
                    Lunch Special £19.95
                  </Link>
                </li>
                <li>
                  <Link href="/menu/a-la-carte" className="text-amber-600 hover:text-amber-700 transition-colors">
                    À La Carte Menu
                  </Link>
                </li>
                <li>
                  <Link href="/menu/december-christmas-menu" className="text-amber-600 hover:text-amber-700 transition-colors">
                    Christmas Menu
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Information</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/about" className="text-amber-600 hover:text-amber-700 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact#opening-hours" className="text-amber-600 hover:text-amber-700 transition-colors">
                    Opening Hours
                  </Link>
                </li>
                <li>
                  <Link href="/contact#location" className="text-amber-600 hover:text-amber-700 transition-colors">
                    Location & Directions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <p className="text-gray-600 mb-4">Need immediate assistance?</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="tel:02084215550" 
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">020 8421 5550</span>
            </a>
            <div className="hidden sm:block w-px h-6 bg-gray-300" />
            <a 
              href="mailto:reservations@donatheresa.com" 
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">reservations@donatheresa.com</span>
            </a>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>451 Uxbridge Road, Pinner HA5 4JR</span>
          </div>
        </div>

        {/* Error Code for Debugging */}
        <div className="mt-12 text-center text-xs text-gray-400">
          Error Code: 404 | <span className="font-mono">not_found</span>
        </div>
      </div>
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Dona Theresa Italian Restaurant</h3>
              <p className="text-gray-400">Authentic Italian Cuisine Since 2011</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <a href="tel:02084215550" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
                <Phone className="w-4 h-4" />
                020 8421 5550
              </a>
              <span className="hidden sm:inline text-gray-600">•</span>
              <a href="mailto:reservations@donatheresa.com" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
                <Mail className="w-4 h-4" />
                reservations@donatheresa.com
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
              <MapPin className="w-4 h-4" />
              451 Uxbridge Road, Pinner HA5 4JR
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <Link href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</Link>
                <Link href="/menu" className="text-gray-400 hover:text-amber-400 transition-colors">Menu</Link>
                <Link href="/reserve" className="text-gray-400 hover:text-amber-400 transition-colors">Reservations</Link>
                <Link href="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Contact</Link>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-amber-400 transition-colors">Cookie Policy</Link>
                <Link href="/sitemap.xml" className="text-gray-400 hover:text-amber-400 transition-colors">Sitemap</Link>
              </div>
              
              <p className="text-gray-600 mt-4 text-xs">
                © {new Date().getFullYear()} Dona Theresa Restaurant. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
