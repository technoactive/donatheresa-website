"use client"

import Link from "next/link"
import { MapPin, Phone, Clock, Instagram, Facebook, ArrowUp, LucideProps } from "lucide-react"

// Custom TikTok icon - Simple Icons official path
const TikTok = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20"
    height="20"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

// Custom TripAdvisor icon - Simple Icons official path
const TripAdvisor = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20"
    height="20"
    {...props}
  >
    <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 004.04 10.43 5.976 5.976 0 004.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 004.072 1.598 6 6 0 004.041-10.43L24 6.649h-4.35a13.573 13.573 0 00-7.644-2.354zM12 6.255c1.531 0 3.063.303 4.504.903C14.944 8.02 14 9.9 14 12c0 .737.132 1.445.372 2.1l-1.063 1.156L12 16.805l-1.31-1.548-1.062-1.156A5.963 5.963 0 0110 12c0-2.1-.944-3.98-2.504-4.842A11.166 11.166 0 0112 6.255zM6.003 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm11.994 0a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6.003 10.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm11.994 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
  </svg>
)
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
  },
  {
    title: "Dining",
    links: [
      { label: "Restaurants in Hatch End", href: "/restaurants-hatch-end" },
      { label: "Restaurants in Pinner", href: "/restaurants-pinner" },
      { label: "Lunch in Pinner", href: "/lunch-pinner" },
      { label: "Best Italian Near Me", href: "/best-italian-restaurant-near-me" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Sitemap", href: "/sitemap.xml" }
    ]
  }
]

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/donatheresahatchend/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=100063506503168", label: "Facebook" },
  { icon: TikTok, href: "https://www.tiktok.com/@dona.theresa", label: "TikTok" },
  { icon: TripAdvisor, href: "https://www.tripadvisor.co.uk/Restaurant_Review-g7380842-d3226259-Reviews-Dona_Theresa-Pinner_Greater_London_England.html", label: "TripAdvisor" }
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
          <div className="grid lg:grid-cols-5 gap-12">
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
                © {new Date().getFullYear()} <RestaurantInfo type="name" />. All rights reserved. Crafted with passion for culinary excellence.
                <span className="mx-1.5">·</span>
                Website by{' '}
                <a
                  href="https://technoactive.co.uk"
                  target="_blank"
                  rel="noopener"
                  className="text-zinc-300 hover:text-white transition-colors duration-300"
                >
                  TechnoActive
                </a>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors duration-300 flex items-center justify-center"
                      aria-label={social.label}
                      style={{ width: 44, height: 44 }}
                    >
                      <social.icon style={{ width: 20, height: 20 }} />
                    </a>
                  ))}
                </div>
                
                {/* Scroll to Top */}
                <Button
                  onClick={scrollToTop}
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50 text-white rounded-xl transition-colors duration-300"
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
