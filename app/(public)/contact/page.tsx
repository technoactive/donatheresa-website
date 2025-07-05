"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { MapPin, Phone, Clock, Send, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { submitContactMessage } from "./actions"
import { toast } from "sonner"
import { RestaurantInfo, RestaurantPhoneLink } from "@/components/locale/restaurant-info"

// Contact info now uses locale components dynamically in the render

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const result = await submitContactMessage(formData)
      
      if (result.success) {
        toast.success(result.message)
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        })
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again or call us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }))
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ minHeight: 'calc(100vh - 80px)', marginTop: '80px' }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black z-10" />
          <Image
            src="/gallery-interior.png"
            alt="Restaurant interior"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        <div className="absolute inset-0 z-20">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-2xl" />
        </div>

        <div className="relative z-30 max-w-7xl mx-auto px-6 w-full text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
                <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                  GET IN TOUCH
                </span>
                <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
              </div>
              
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-none tracking-tight">
                <span className="block text-white">CONTACT</span>
                <span className="block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  US
                </span>
              </h1>
              
              <p className="text-xl text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
                We'd love to hear from you! Get in touch with any questions about our restaurant, 
                menu, or services. Our team will respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                Contact Information
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Multiple ways to reach our team for any inquiries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Location Card */}
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl rounded-3xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-500 hover:scale-105">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Location</h3>
                
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    <RestaurantInfo type="address" fallback="451 Uxbridge Rd" />
                  </p>
                  <p className="text-zinc-400">
                    <RestaurantInfo type="city" fallback="Pinner" /> <RestaurantInfo type="postalCode" fallback="HA5 4JR" />
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl rounded-3xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-500 hover:scale-105">
                <div className="p-4 bg-gradient-to-r from-amber-600 to-yellow-400 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Phone</h3>
                
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    <RestaurantPhoneLink className="hover:text-amber-400 transition-colors">
                      <RestaurantInfo type="phone" fallback="020 8421 5550" />
                    </RestaurantPhoneLink>
                  </p>
                  <p className="text-zinc-400">Daily 12:00 - 22:00</p>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl rounded-3xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-500 hover:scale-105">
                <div className="p-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Hours</h3>
                
                <div className="space-y-2">
                  <p className="text-white font-medium">Tuesday - Sunday</p>
                  <p className="text-zinc-400">12:00 - 15:00, 18:00 - 23:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-amber-400" />
              <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                SEND MESSAGE
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Get in</span>
              <span className="block bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Have questions about our menu, want to provide feedback, or need assistance? 
              Fill out the form below and we'll respond promptly.
            </p>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-zinc-700/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Full Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-400 rounded-xl py-3 focus:border-amber-400 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-400 rounded-xl py-3 focus:border-amber-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Phone (Optional)</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-400 rounded-xl py-3 focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Subject *</label>
                  <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white rounded-xl py-3 focus:border-amber-400 transition-colors">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="menu">Menu Inquiry</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="private-events">Private Events</SelectItem>
                      <SelectItem value="catering">Catering Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Message *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can we help you today? Please provide details about your inquiry..."
                  className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-400 rounded-xl py-3 h-32 resize-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>

              <p className="text-sm text-zinc-400 text-center">
                For immediate assistance with reservations, please call us directly at{' '}
                <RestaurantPhoneLink className="text-amber-400 hover:text-amber-300">
                  <RestaurantInfo type="phone" fallback="020 8421 5550" />
                </RestaurantPhoneLink>{' '}or{" "}
                <Link href="/reserve" className="text-amber-400 hover:text-amber-300 underline">
                  visit our reservations page
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
 