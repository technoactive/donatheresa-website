"use client"

import Link from "next/link"
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RestaurantInfo, RestaurantPhoneLink } from "@/components/locale/restaurant-info"

const footerLinks = [
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Menu", href: "/menu" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Reservations",
    links: [
      { label: "Book Table", href: "/reserve" },
      { label: "Private Events", href: "/contact" },
      { label: "Chef's Table", href: "/contact" },
      { label: "Wine Pairing", href: "/contact" }
    ]
  }
]

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" }
]

export function PublicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-yellow-600/10 to-amber-600/10 rounded-full blur-2xl" />
      </div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent tracking-tight">
                  <RestaurantInfo type="name" className="uppercase" />
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
                      <RestaurantInfo type="address" />
                    </div>
                    <div className="text-sm text-zinc-400">
                      <RestaurantInfo type="city" /> <RestaurantInfo type="postalCode" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
                    <Phone className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      <RestaurantPhoneLink className="hover:text-amber-400 transition-colors">
                        <RestaurantInfo type="phone" />
                      </RestaurantPhoneLink>
                    </div>
                    <div className="text-sm text-zinc-400">Reservations & Inquiries</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Tuesday - Sunday</div>
                    <div className="text-sm text-zinc-400">12:00 - 15:00, 18:00 - 23:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-lg font-bold text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                      >
                        <div className="w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-zinc-400 text-sm">
                © 2025 <RestaurantInfo type="name" />. All rights reserved. Crafted with passion for culinary excellence.
              </div>
              
              <div className="flex items-center gap-6">
                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
                
                {/* Scroll to Top */}
                <Button
                  onClick={scrollToTop}
                  variant="outline"
                  size="icon"
                  className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border-amber-400/30 hover:border-amber-400/50 text-amber-400 hover:text-white rounded-xl transition-colors duration-300"
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
