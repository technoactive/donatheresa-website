"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Phone, Clock, Send, MessageSquare, CheckCircle, ArrowRight, Mail, User, Calendar, Star, Map as MapIcon, PhoneIcon, Navigation, ChefHat } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { submitContactMessage } from "@/app/(public)/contact/actions"
import { toast } from "sonner"
import { RestaurantInfo, RestaurantPhoneLink } from "@/components/locale/restaurant-info"

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasStartedForm, setHasStartedForm] = useState(false)

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
        
        // Track conversion in Google Analytics SYNCHRONOUSLY
        if (result.conversionData && typeof window !== 'undefined' && window.gtag) {
          const { messageId, subject, contactType } = result.conversionData
          
          console.log('[GA4] Tracking generate_lead event:', { messageId, subject, contactType })
          
          // Fire generate_lead event (this is what GA4 counts as a lead)
          window.gtag('event', 'generate_lead', {
            currency: 'GBP',
            value: 10, // Estimated value of a contact form lead
            lead_source: 'website_contact_form',
            form_id: 'contact_page_form',
            form_name: 'Contact Form',
            contact_type: contactType,
            subject_category: subject,
            device_type: /mobile|android|iphone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
          })
          
          // Also fire a contact_form_submit event for easier tracking
          window.gtag('event', 'contact_form_submit', {
            message_id: messageId,
            subject: subject,
            contact_type: contactType
          })
        }
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
    
    // Track form start (only once)
    if (!hasStartedForm) {
      setHasStartedForm(true)
      import('@/lib/analytics').then(({ trackContactFormEvent, trackEvent }) => {
        trackContactFormEvent('start')
        
        // Additional form_start event for funnel analysis
        trackEvent('form_start', {
          form_id: 'contact_page_form',
          form_name: 'Contact Form',
          form_destination: '/contact',
          first_field_interacted: e.target.name,
          device_type: /mobile|android|iphone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        })
      })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }))
    
    // Track form start if selecting subject is the first interaction
    if (!hasStartedForm) {
      setHasStartedForm(true)
      import('@/lib/analytics').then(({ trackContactFormEvent, trackEvent }) => {
        trackContactFormEvent('start')
        
        trackEvent('form_start', {
          form_id: 'contact_page_form',
          form_name: 'Contact Form',
          form_destination: '/contact',
          first_field_interacted: 'subject',
          selected_subject: value,
          device_type: /mobile|android|iphone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        })
      })
    }
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
    <div className="bg-white min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-40 md:pt-48 lg:pt-52 pb-16 md:pb-24">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-emerald-50"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-40" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-10">
            {/* Premium Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-slate-900">Let's Start a</span>
                <span className="block mt-2">
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 blur-xl opacity-20"></span>
                    <span className="relative bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                      Conversation
                    </span>
                  </span>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                Whether you're planning a special celebration, have questions about our authentic Italian cuisine, 
                or simply want to share your thoughts – we're all ears.
              </p>
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white shadow-2xl transition-all duration-300 px-10 py-7 text-lg rounded-full"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  <Send className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Send Us a Message
                </span>
              </Button>
                
              <Button 
                variant="outline" 
                size="lg" 
                className="group border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-10 py-7 text-lg rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/reserve">
                  <Calendar className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Book a Table
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">24h</div>
                <div className="text-sm text-slate-600 mt-1">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">7</div>
                <div className="text-sm text-slate-600 mt-1">Days a Week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-600 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Contact Info Bar */}
      <section className="relative bg-slate-50 py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <PhoneIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">Direct Line</p>
                  <RestaurantPhoneLink className="text-lg font-semibold text-slate-900 hover:text-amber-600 transition-colors flex items-center group">
                    <RestaurantInfo type="phone" fallback="020 8421 5550" />
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </RestaurantPhoneLink>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">Location</p>
                  <p className="text-lg font-semibold text-slate-900">
                    <RestaurantInfo type="address" fallback="451 Uxbridge Rd" />
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">Open Today</p>
                  <p className="text-lg font-semibold text-slate-900">12:00 - 23:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Contact Form Section */}
      <section id="contact-form" className="py-20 md:py-32 relative bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative shadow-2xl border-0 overflow-hidden bg-white">
            {/* Premium Form Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800"></div>
              <div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
              <div className="relative p-8 md:p-12">
                <CardHeader className="p-0 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                      Get in Touch
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-200 text-lg leading-relaxed">
                    Have a question? Need to make a special arrangement? We're here to help make your dining experience perfect.
                  </CardDescription>
                </CardHeader>
              </div>
            </div>

            <CardContent className="p-8 md:p-10 lg:p-12">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Personal Information */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">Your Information</h3>
                        <p className="text-sm text-slate-500">Tell us who you are</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 tracking-wide">
                          Full Name *
                        </label>
                        <div className="relative">
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="h-14 pl-4 pr-4 text-base border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 rounded-xl transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 tracking-wide">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="h-14 pl-4 pr-4 text-base border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 rounded-xl transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 tracking-wide">
                        Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="020 1234 5678"
                          className="h-14 pl-4 pr-4 text-base border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 rounded-xl transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-sm text-slate-500">Message Details</span>
                    </div>
                  </div>

                  {/* Message Details */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">Your Message</h3>
                        <p className="text-sm text-slate-500">How can we help you today?</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 tracking-wide">
                        Subject *
                      </label>
                      <Select onValueChange={handleSelectChange} required>
                        <SelectTrigger className="h-14 text-base border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 rounded-xl transition-all duration-200">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="general" className="py-3">General Question</SelectItem>
                          <SelectItem value="menu" className="py-3">Menu Inquiry</SelectItem>
                          <SelectItem value="feedback" className="py-3">Feedback & Reviews</SelectItem>
                          <SelectItem value="private-events" className="py-3">Private Events</SelectItem>
                          <SelectItem value="catering" className="py-3">Catering Services</SelectItem>
                          <SelectItem value="other" className="py-3">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Hidden input to ensure subject is included in FormData */}
                      <input type="hidden" name="subject" value={formData.subject} />
                      {/* Honeypot field - hidden from users but visible to bots */}
                      <input 
                        type="text" 
                        name="website" 
                        className="absolute -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 tracking-wide">
                        Your Message *
                      </label>
                      <div className="relative">
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about your inquiry. The more details you provide, the better we can assist you..."
                          className="min-h-[150px] pl-4 pr-4 py-4 text-base border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 rounded-xl transition-all duration-200 resize-none"
                          required
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                          {formData.message.length}/500
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full h-16 bg-slate-900 hover:bg-slate-800 text-white text-lg font-medium rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                      <span className="relative">
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Sending Your Message...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-3">
                            <Send className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span>Send Message</span>
                          </div>
                        )}
                      </span>
                    </Button>
                  </div>

                  {/* Premium Help Section */}
                  <div className="relative">
                    <Alert className="relative border-0 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-6">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                      <AlertDescription className="relative text-slate-700 leading-relaxed">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <span className="font-semibold text-slate-900">Need immediate assistance?</span>
                            <p className="mt-1">
                              Call us directly at{' '}
                              <RestaurantPhoneLink className="font-semibold text-amber-600 hover:text-amber-700 underline decoration-amber-300 underline-offset-2 transition-colors">
                                <RestaurantInfo type="phone" fallback="020 8421 5550" />
                              </RestaurantPhoneLink>{' '}
                              or{' '}
                              <Link href="/reserve" className="font-semibold text-emerald-600 hover:text-emerald-700 underline decoration-emerald-300 underline-offset-2 transition-colors">
                                book a table online
                              </Link>
                              .
                            </p>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                </form>
              ) : (
                <div className="text-center py-16">
                  {/* Success Animation Container */}
                  <div className="relative inline-block mb-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                    <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                      <CheckCircle className="w-14 h-14 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Message Delivered!
                      </h3>
                      <div className="flex justify-center space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="relative">
                            <Star className="w-6 h-6 text-amber-400 fill-current" />
                            <div className="absolute inset-0 bg-amber-400 blur-sm opacity-50"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <p className="text-xl text-slate-700 font-medium leading-relaxed">
                        Thank you for contacting Dona Theresa
                      </p>
                      
                      <p className="text-lg text-slate-600 leading-relaxed">
                        We've received your message and will respond within 24 hours. 
                        Our team is excited to assist you with your inquiry.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        size="lg"
                        className="group border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-10 py-6 rounded-xl transition-all duration-300"
                      >
                        <MessageSquare className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        Send Another Message
                      </Button>
                      
                      <Button
                        size="lg"
                        className="group relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white px-10 py-6 rounded-xl transition-all duration-300"
                        asChild
                      >
                        <Link href="/reserve">
                          <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span className="relative flex items-center">
                            <Calendar className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                            Book Your Table
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Premium Contact Information Cards */}
      <section className="py-24 md:py-32 relative bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full blur-xl opacity-20"></div>
                <Badge className="relative bg-white border-0 shadow-lg text-slate-800 px-8 py-3 text-sm font-medium tracking-wide">
                  <ChefHat className="w-4 h-4 mr-2 text-amber-600" />
                  Visit Dona Theresa
                </Badge>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              We're Always Here for You
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Whether you prefer to call, visit, or message us online – we're ready to help make your experience exceptional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Premium Location Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <Card className="relative h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden rounded-2xl bg-white">
                <div className="relative h-48 bg-gradient-to-br from-amber-500 to-amber-600 p-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                      <Navigation className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Find Us</h3>
                    <p className="text-amber-100">In the heart of Pinner</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg font-semibold text-slate-900 mb-1">
                        <RestaurantInfo type="address" fallback="451 Uxbridge Rd" />
                      </p>
                      <p className="text-slate-600">
                        <RestaurantInfo type="city" fallback="Pinner" />, <RestaurantInfo type="postalCode" fallback="HA5 4JR" />
                      </p>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <p>Free parking available on-site</p>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <p>5 minutes walk from Pinner Station</p>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <p>Fully wheelchair accessible</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Premium Phone Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <Card className="relative h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden rounded-2xl bg-white">
                <div className="relative h-48 bg-gradient-to-br from-emerald-500 to-emerald-600 p-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Call Us</h3>
                    <p className="text-emerald-100">Direct line available</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg font-semibold text-slate-900 mb-1">
                        <RestaurantPhoneLink className="hover:text-emerald-600 transition-colors flex items-center group">
                          <RestaurantInfo type="phone" fallback="020 8421 5550" />
                          <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                        </RestaurantPhoneLink>
                      </p>
                      <p className="text-slate-600">Available during service hours</p>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p>Table reservations & enquiries</p>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p>Private events & celebrations</p>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p>Dietary requirements & allergies</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Premium Hours Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <Card className="relative h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden rounded-2xl bg-white">
                <div className="relative h-48 bg-gradient-to-br from-yellow-500 to-amber-500 p-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Open Hours</h3>
                    <p className="text-yellow-100">Tuesday to Sunday</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">Lunch Service</p>
                      <p className="text-slate-600 mb-3">12:00 PM - 3:00 PM</p>
                      <p className="text-lg font-semibold text-slate-900">Dinner Service</p>
                      <p className="text-slate-600">6:00 PM - 11:00 PM</p>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p>Last orders at 10:30 PM</p>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p>Happy hour: 6:00 PM - 7:30 PM</p>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p>Closed Mondays</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
 