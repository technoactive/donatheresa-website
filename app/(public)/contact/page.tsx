"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { MapPin, Phone, Clock, Send, MessageSquare, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
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
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Auto-scroll to contact form when page loads from navigation - MOBILE ONLY
    const timer = setTimeout(() => {
      // Only scroll on mobile devices (width < 768px)
      if (window.innerWidth < 768) {
        const contactFormSection = document.getElementById('contact-form')
        if (contactFormSection) {
          contactFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 500) // Small delay to allow page to fully load

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const result = await submitContactMessage(formData)
      
      if (result.success) {
        toast.success(result.message)
        setIsSubmitted(true)
        // Reset form data
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

  const resetForm = () => {
    setIsSubmitted(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    })
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Hero Section - Half Height */}
      <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/20" style={{ height: '50vh', marginTop: '80px' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-amber-100/30 to-yellow-100/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-orange-100/20 to-amber-100/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-100/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-amber-200/50 text-slate-700 px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span className="tracking-[0.2em] uppercase">Get in Touch</span>
              <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
              <span className="block text-slate-900">CONTACT</span>
              <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                US
              </span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
                We'd Love to Hear From You
              </p>
              
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
              
              <p className="text-lg text-slate-500 leading-relaxed">
                Get in touch with any questions about our restaurant, menu, or services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Now Second */}
      <section id="contact-form" className="py-20 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-yellow-100/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-100/15 to-amber-100/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-amber-200/50 text-slate-700 px-6 py-3 rounded-full text-sm font-medium shadow-lg mb-6">
              <Send className="w-4 h-4 text-amber-600" />
              <span className="tracking-[0.2em] uppercase">Send Message</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Send Us a Message
            </h2>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Have questions about our menu, want to provide feedback, or need assistance? 
              Fill out the form below and we'll respond promptly.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 lg:p-12">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-900 font-medium mb-2">Full Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 rounded-xl py-3 focus:border-amber-400 focus:ring-amber-400 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-900 font-medium mb-2">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 rounded-xl py-3 focus:border-amber-400 focus:ring-amber-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-900 font-medium mb-2">Phone (Optional)</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 rounded-xl py-3 focus:border-amber-400 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-900 font-medium mb-2">Subject *</label>
                    <Select onValueChange={handleSelectChange} required>
                      <SelectTrigger className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl py-3 focus:border-amber-400 focus:ring-amber-400 transition-colors">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-300">
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="menu">Menu Inquiry</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="private-events">Private Events</SelectItem>
                        <SelectItem value="catering">Catering Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Hidden input to ensure subject is included in FormData */}
                    <input type="hidden" name="subject" value={formData.subject} />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-900 font-medium mb-2">Message *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="How can we help you today? Please provide details about your inquiry..."
                    className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 rounded-xl py-3 h-32 resize-none focus:border-amber-400 focus:ring-amber-400 transition-colors"
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

                <p className="text-sm text-slate-600 text-center">
                  For immediate assistance with reservations, please call us directly at{' '}
                  <RestaurantPhoneLink className="text-amber-600 hover:text-amber-700 font-medium">
                    <RestaurantInfo type="phone" fallback="020 8421 5550" />
                  </RestaurantPhoneLink>{' '}or{" "}
                  <Link href="/reserve" className="text-amber-600 hover:text-amber-700 font-medium underline">
                    visit our reservations page
                  </Link>
                </p>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    Thank You for Your Message!
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-xl text-slate-600 font-medium">
                      Your message has been sent successfully.
                    </p>
                    
                    <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                      Our dedicated team will review your inquiry and respond within 24 hours. 
                      We appreciate your interest in Dona Theresa and look forward to assisting you.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl px-6 py-3 transition-all duration-300"
                    >
                      Send Another Message
                    </Button>
                    
                    <Link href="/reserve">
                      <Button className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105">
                        Make a Reservation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                      Need immediate assistance? Call us at{' '}
                      <RestaurantPhoneLink className="text-amber-600 hover:text-amber-700 font-medium">
                        <RestaurantInfo type="phone" fallback="020 8421 5550" />
                      </RestaurantPhoneLink>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info Cards - Now Third Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
              <span className="text-sm tracking-[0.3em] text-slate-600 font-light uppercase">
                Contact Information
              </span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Get in Touch
            </h2>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Multiple ways to reach our team for any inquiries, reservations, or special requests
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Location Card */}
            <div className="group relative">
              <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-700 transition-colors duration-300">
                  Location
                </h3>
                
                <div className="space-y-2">
                  <p className="text-slate-900 font-medium">
                    <RestaurantInfo type="address" fallback="451 Uxbridge Rd" />
                  </p>
                  <p className="text-slate-600">
                    <RestaurantInfo type="city" fallback="Pinner" /> <RestaurantInfo type="postalCode" fallback="HA5 4JR" />
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group relative">
              <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                  Phone
                </h3>
                
                <div className="space-y-2">
                  <p className="text-slate-900 font-medium">
                    <RestaurantPhoneLink className="hover:text-amber-600 transition-colors">
                      <RestaurantInfo type="phone" fallback="020 8421 5550" />
                    </RestaurantPhoneLink>
                  </p>
                  <p className="text-slate-600">Daily 12:00 - 22:00</p>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="group relative">
              <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                  Hours
                </h3>
                
                <div className="space-y-2">
                  <p className="text-slate-900 font-medium">Tuesday - Sunday</p>
                  <p className="text-slate-600">12:00 - 15:00, 18:00 - 23:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
 