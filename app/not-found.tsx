import { Metadata } from 'next'
import Link from 'next/link'
import { Search, Home, MapPin, Phone, Clock, ChefHat, Calendar, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Dona Theresa Italian Restaurant',
  description: 'The page you are looking for could not be found. Browse our menu, make a reservation, or contact us.',
  robots: 'noindex, follow',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
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
                href="mailto:reservations@donatheresa.co.uk" 
                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">reservations@donatheresa.co.uk</span>
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

      {/* Footer - Matching the global footer style */}
      <footer className="relative bg-black overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-yellow-600/10 to-amber-600/10 rounded-full blur-2xl" />
        </div>
        
        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent tracking-tight">
                    DONA THERESA
                  </div>
                  <div className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                    CULINARY EXCELLENCE
                  </div>
                </div>
                
                <p className="text-lg text-zinc-300 leading-relaxed max-w-lg">
                  Where modern gastronomy meets timeless sophistication. 
                  An elevated dining experience that transcends the ordinary.
                </p>
                
                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
                      <MapPin className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        451 Uxbridge Road
                      </div>
                      <div className="text-sm text-zinc-400">
                        Pinner HA5 4JR
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
                      <Phone className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <a href="tel:+442084215550" className="text-white font-medium hover:text-amber-400 transition-colors">
                        +44 20 8421 5550
                      </a>
                      <div className="text-sm text-zinc-400">
                        Reservations & Inquiries
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Tuesday - Sunday</div>
                      <div className="text-sm text-zinc-400">
                        12:00 - 15:00, 18:00 - 23:00
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h3 className="font-semibold text-white tracking-wide">Navigate</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/" className="text-zinc-300 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-zinc-300 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/menu" className="text-zinc-300 hover:text-white transition-colors">
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Reservations Links */}
              <div className="space-y-6">
                <h3 className="font-semibold text-white tracking-wide">Reservations</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/reserve" className="text-zinc-300 hover:text-white transition-colors">
                      Book Table
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">
                      Private Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">
                      Chef's Table
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">
                      Wine Pairing
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div className="space-y-6">
                <h3 className="font-semibold text-white tracking-wide">Legal</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/cookie-policy" className="text-zinc-300 hover:text-white transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/sitemap.xml" className="text-zinc-300 hover:text-white transition-colors">
                      Sitemap
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-800/50">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-sm text-zinc-400">
                © {new Date().getFullYear()} Dona Theresa. All rights reserved. Crafted with passion for culinary excellence.
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}