"use client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { MapPin, Phone, Clock, Send, MessageSquare, CheckCircle, ArrowRight, Mail, User, Calendar, Star, Map, PhoneIcon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { submitContactMessage } from "./actions"
import { toast } from "sonner"
import { RestaurantInfo, RestaurantPhoneLink } from "@/components/locale/restaurant-info"

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
    <div className="bg-gradient-to-b from-stone-50 to-cream-50 min-h-screen">
      {/* Elegant Italian Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-10 md:pb-16">
        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-amber-50 to-emerald-50 opacity-60"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(133,77,14,0.08)_0%,_transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(21,128,61,0.06)_0%,_transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Elegant Badge */}
            <div className="flex justify-center">
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-amber-600/30 text-amber-800 px-6 py-2 text-sm font-medium">
                <MessageSquare className="w-4 h-4 mr-2" />
                Get in Touch
              </Badge>
            </div>

            {/* Elegant Italian Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                We'd Love to
                <span className="block bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 bg-clip-text text-transparent">
                  Hear from You
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Questions about our menu? Want to share feedback? Ready to plan your perfect dining experience?
              </p>
            </div>

            {/* Elegant CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                              <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/reserve">
                    <Calendar className="w-5 h-5 mr-2" />
                    Make Reservation
                  </Link>
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Contact Info Bar */}
      <section className="py-6 bg-white/70 backdrop-blur-sm border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-700 to-amber-600 rounded-full flex items-center justify-center">
                <PhoneIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-stone-600">Call Us</p>
                <RestaurantPhoneLink className="text-slate-800 font-semibold hover:text-amber-700 transition-colors">
                  <RestaurantInfo type="phone" fallback="020 8421 5550" />
                </RestaurantPhoneLink>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-full flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-stone-600">Visit Us</p>
                <p className="text-slate-800 font-semibold">
                  <RestaurantInfo type="address" fallback="451 Uxbridge Rd" />
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-stone-600">Open Hours</p>
                <p className="text-slate-800 font-semibold">Tue-Sun 12:00-23:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Italian Contact Form Section */}
      <section id="contact-form" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-6 md:p-8">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl md:text-4xl font-bold text-white flex items-center">
                  <MessageSquare className="w-8 h-8 mr-3" />
                  Send Us a Message
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg mt-2">
                  We typically respond within 24 hours. For urgent matters, please call us directly.
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="p-6 md:p-8 lg:p-12">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="w-5 h-5 text-amber-700" />
                      <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                          Full Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="h-12 text-base border-stone-300 focus:border-amber-600 focus:ring-amber-600 transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                          Email Address *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="h-12 text-base border-stone-300 focus:border-amber-600 focus:ring-amber-600 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Phone Number <span className="text-stone-500">(Optional)</span>
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="020 1234 5678"
                        className="h-12 text-base border-stone-300 focus:border-amber-600 focus:ring-amber-600 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <Separator className="my-8 bg-stone-200" />

                  {/* Message Details */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Mail className="w-5 h-5 text-amber-700" />
                      <h3 className="text-lg font-semibold text-slate-800">Message Details</h3>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Subject *
                      </label>
                      <Select onValueChange={handleSelectChange} required>
                        <SelectTrigger className="h-12 text-base border-stone-300 focus:border-amber-600 focus:ring-amber-600 transition-all duration-200">
                          <SelectValue placeholder="What can we help you with?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="menu">Menu Inquiry</SelectItem>
                          <SelectItem value="feedback">Feedback & Reviews</SelectItem>
                          <SelectItem value="private-events">Private Events</SelectItem>
                          <SelectItem value="catering">Catering Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Hidden input to ensure subject is included in FormData */}
                      <input type="hidden" name="subject" value={formData.subject} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Your Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please share your thoughts, questions, or special requests. We'd love to hear from you!"
                        className="min-h-[120px] text-base border-stone-300 focus:border-amber-600 focus:ring-amber-600 transition-all duration-200 resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                                              {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Sending Message...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Send className="w-5 h-5" />
                            <span>Send Message</span>
                          </div>
                        )}
                    </Button>
                  </div>

                  {/* Help Text */}
                                      <Alert className="border-amber-200 bg-amber-50/50">
                      <AlertDescription className="text-amber-800">
                        <strong>Need immediate help?</strong> Call us at{' '}
                        <RestaurantPhoneLink className="font-semibold text-amber-700 hover:text-amber-600 underline">
                          <RestaurantInfo type="phone" fallback="020 8421 5550" />
                        </RestaurantPhoneLink>{' '}
                        or{' '}
                        <Link href="/reserve" className="font-semibold text-amber-700 hover:text-amber-600 underline">
                          make a reservation online
                        </Link>
                        .
                      </AlertDescription>
                    </Alert>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  
                                      <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-800">
                          Message Sent Successfully!
                        </h3>
                        <div className="flex justify-center">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 max-w-2xl mx-auto">
                        <p className="text-xl text-slate-600 font-medium">
                          Thank you for reaching out to Dona Theresa!
                        </p>
                        
                        <p className="text-lg text-slate-500 leading-relaxed">
                          Your message has been received and our team will respond within 24 hours. 
                          We appreciate your interest and look forward to serving you.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          size="lg"
                          className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-6"
                        >
                          Send Another Message
                        </Button>
                        
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white px-8 py-6"
                          asChild
                        >
                          <Link href="/reserve">
                            <Calendar className="w-5 h-5 mr-2" />
                            Make a Reservation
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

      {/* Elegant Italian Contact Information Cards */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="bg-white border-amber-600/30 text-amber-700 mb-4">
              Contact Information
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the most convenient way to reach us for reservations, inquiries, or special requests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-amber-700 to-amber-600 p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Visit Our Restaurant</h3>
                <p className="text-amber-100">Find us in the heart of Pinner</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      <RestaurantInfo type="address" fallback="451 Uxbridge Rd" />
                    </p>
                    <p className="text-slate-600">
                      <RestaurantInfo type="city" fallback="Pinner" />, <RestaurantInfo type="postalCode" fallback="HA5 4JR" />
                    </p>
                  </div>
                  <Separator className="bg-stone-200" />
                  <div className="text-sm text-slate-500">
                    <p>🚗 Free parking available</p>
                    <p>🚇 5 minutes from Pinner Station</p>
                    <p>♿ Wheelchair accessible</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Call Us Directly</h3>
                <p className="text-emerald-100">Immediate assistance available</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      <RestaurantPhoneLink className="hover:text-emerald-600 transition-colors">
                        <RestaurantInfo type="phone" fallback="020 8421 5550" />
                      </RestaurantPhoneLink>
                    </p>
                    <p className="text-slate-600">Available during opening hours</p>
                  </div>
                  <Separator className="bg-stone-200" />
                  <div className="text-sm text-slate-500">
                    <p>📞 Reservations & inquiries</p>
                    <p>🎉 Private events planning</p>
                    <p>🍽️ Special dietary requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hours Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-yellow-600 to-amber-600 p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Opening Hours</h3>
                <p className="text-yellow-100">Tuesday to Sunday</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-800">Lunch: 12:00 - 15:00</p>
                    <p className="font-semibold text-slate-800">Dinner: 18:00 - 23:00</p>
                    <p className="text-slate-600">Closed Mondays</p>
                  </div>
                  <Separator className="bg-stone-200" />
                  <div className="text-sm text-slate-500">
                    <p>🕐 Last orders: 22:30</p>
                    <p>🍷 Happy hour: 18:00 - 19:30</p>
                    <p>📅 Holiday hours may vary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
 