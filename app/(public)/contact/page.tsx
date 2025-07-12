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
      <section className="relative overflow-hidden pt-20 pb-10 md:pb-16">
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
                Contattaci
              </Badge>
            </div>

            {/* Elegant Italian Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                Siamo Qui per
                <span className="block bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 bg-clip-text text-transparent">
                  Ascoltarti
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Domande sul nostro menu? Vuoi condividere un feedback? Pronto a pianificare la tua esperienza culinaria perfetta?
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
                Invia Messaggio
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg"
                asChild
              >
                <Link href="/reserve">
                  <Calendar className="w-5 h-5 mr-2" />
                  Prenota Tavolo
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
                <p className="text-sm font-medium text-stone-600">Chiamaci</p>
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
                <p className="text-sm font-medium text-stone-600">Visitaci</p>
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
                <p className="text-sm font-medium text-stone-600">Orari</p>
                <p className="text-slate-800 font-semibold">Mar-Dom 12:00-23:00</p>
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
                  Inviaci un Messaggio
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg mt-2">
                  Rispondiamo tipicamente entro 24 ore. Per questioni urgenti, chiamaci direttamente.
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
                      <h3 className="text-lg font-semibold text-slate-800">Informazioni Personali</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                          Nome Completo *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Inserisci il tuo nome completo"
                          className="h-12 text-base border-stone-300 focus:border-amber-600 focus:ring-amber-600 transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                          Indirizzo Email *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tua@email.com"
                          className="h-12 text-base border-stone-300 focus:border-amber-600 focus:ring-amber-600 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Numero di Telefono <span className="text-stone-500">(Opzionale)</span>
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
                      <h3 className="text-lg font-semibold text-slate-800">Dettagli del Messaggio</h3>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Argomento *
                      </label>
                      <Select onValueChange={handleSelectChange} required>
                        <SelectTrigger className="h-12 text-base border-stone-300 focus:border-amber-600 focus:ring-amber-600 transition-all duration-200">
                          <SelectValue placeholder="Come possiamo aiutarti?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Domanda Generale</SelectItem>
                          <SelectItem value="menu">Richiesta Menu</SelectItem>
                          <SelectItem value="feedback">Feedback e Recensioni</SelectItem>
                          <SelectItem value="private-events">Eventi Privati</SelectItem>
                          <SelectItem value="catering">Servizi Catering</SelectItem>
                          <SelectItem value="other">Altro</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Hidden input to ensure subject is included in FormData */}
                      <input type="hidden" name="subject" value={formData.subject} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Il Tuo Messaggio *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Condividi i tuoi pensieri, domande o richieste speciali. Ci piacerebbe sentirti!"
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
                          <span>Invio Messaggio...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>Invia Messaggio</span>
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Help Text */}
                  <Alert className="border-amber-200 bg-amber-50/50">
                    <AlertDescription className="text-amber-800">
                      <strong>Hai bisogno di aiuto immediato?</strong> Chiamaci al{' '}
                      <RestaurantPhoneLink className="font-semibold text-amber-700 hover:text-amber-600 underline">
                        <RestaurantInfo type="phone" fallback="020 8421 5550" />
                      </RestaurantPhoneLink>{' '}
                      o{' '}
                      <Link href="/reserve" className="font-semibold text-amber-700 hover:text-amber-600 underline">
                        prenota online
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
                        Messaggio Inviato con Successo!
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
                        Grazie per averci contattato da Dona Theresa!
                      </p>
                      
                      <p className="text-lg text-slate-500 leading-relaxed">
                        Il tuo messaggio è stato ricevuto e il nostro team risponderà entro 24 ore. 
                        Apprezziamo il tuo interesse e non vediamo l'ora di servirti.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        size="lg"
                        className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-6"
                      >
                        Invia un Altro Messaggio
                      </Button>
                      
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white px-8 py-6"
                        asChild
                      >
                        <Link href="/reserve">
                          <Calendar className="w-5 h-5 mr-2" />
                          Prenota un Tavolo
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
              Informazioni di Contatto
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Diversi Modi per Connettersi
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Scegli il modo più conveniente per raggiungerci per prenotazioni, richieste o richieste speciali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-amber-700 to-amber-600 p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Visita il Nostro Ristorante</h3>
                <p className="text-amber-100">Nel cuore di Pinner</p>
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
                    <p>🚗 Parcheggio gratuito disponibile</p>
                    <p>🚇 5 minuti dalla stazione di Pinner</p>
                    <p>♿ Accessibile ai disabili</p>
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
                <h3 className="text-xl font-bold text-white mb-2">Chiamaci Direttamente</h3>
                <p className="text-emerald-100">Assistenza immediata disponibile</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      <RestaurantPhoneLink className="hover:text-emerald-600 transition-colors">
                        <RestaurantInfo type="phone" fallback="020 8421 5550" />
                      </RestaurantPhoneLink>
                    </p>
                    <p className="text-slate-600">Disponibile durante gli orari di apertura</p>
                  </div>
                  <Separator className="bg-stone-200" />
                  <div className="text-sm text-slate-500">
                    <p>📞 Prenotazioni e richieste</p>
                    <p>🎉 Pianificazione eventi privati</p>
                    <p>🍽️ Richieste dietetiche speciali</p>
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
                <h3 className="text-xl font-bold text-white mb-2">Orari di Apertura</h3>
                <p className="text-yellow-100">Martedì a Domenica</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-800">Pranzo: 12:00 - 15:00</p>
                    <p className="font-semibold text-slate-800">Cena: 18:00 - 23:00</p>
                    <p className="text-slate-600">Chiuso il Lunedì</p>
                  </div>
                  <Separator className="bg-stone-200" />
                  <div className="text-sm text-slate-500">
                    <p>🕐 Ultimo ordine: 22:30</p>
                    <p>🍷 Happy hour: 18:00 - 19:30</p>
                    <p>📅 Gli orari festivi possono variare</p>
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
 