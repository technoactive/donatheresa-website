"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Award, Users, Calendar, Crown, Building, Star, Heart, Utensils, MapPin, Clock, Leaf, ChefHat, Wine, Globe } from "lucide-react"

const stats = [
  { icon: Calendar, number: "13+", label: "Years of Service" },
  { icon: Award, number: "25+", label: "Years Excellence" },
  { icon: Users, number: "15K+", label: "Happy Customers" },
  { icon: Star, number: "4.9", label: "Average Rating" }
]

const timeline = [
  {
    year: "2011",
    title: "A New Chapter Begins",
    description: "Dona Theresa opens its doors in Hatch End, bringing authentic Italian cuisine combined with warm Portuguese hospitality to the local community."
  },
  {
    year: "2013",
    title: "Community Recognition",
    description: "Quickly becoming a neighborhood favorite, the restaurant earns its first local award for exceptional Italian dining and outstanding service."
  },
  {
    year: "2015",
    title: "Culinary Excellence",
    description: "The kitchen refines its menu, focusing on traditional recipes made with premium ingredients sourced directly from Italian suppliers."
  },
  {
    year: "2018",
    title: "Sustainable Practices",
    description: "Commitment to sustainability grows with introduction of locally-sourced produce and eco-friendly practices throughout operations."
  },
  {
    year: "2020",
    title: "Adapting with Care",
    description: "During challenging times, the restaurant adapts while maintaining quality, introducing new services to continue serving the community safely."
  },
  {
    year: "2024",
    title: "Continuing the Legacy",
    description: "Today, Dona Theresa remains a cornerstone of Hatch End dining, combining time-honored traditions with modern hospitality excellence."
  }
]

const values = [
  {
    icon: Heart,
    title: "Authentic Heritage",
    description: "Every dish reflects our commitment to authentic Italian culinary traditions, prepared with passion and served with Portuguese warmth."
  },
  {
    icon: Crown,
    title: "Premium Quality",
    description: "We source the finest ingredients directly from trusted Italian suppliers, ensuring every meal meets our exacting standards."
  },
  {
    icon: Users,
    title: "Community Focus",
    description: "More than a restaurant, we're proud to be part of Hatch End's fabric, creating a welcoming space for all occasions."
  },
  {
    icon: Leaf,
    title: "Sustainable Approach",
    description: "Committed to environmental responsibility through local sourcing, waste reduction, and eco-conscious practices."
  }
]

const achievements = [
  {
    year: "2013",
    title: "Best Local Italian Restaurant",
    description: "Recognized by Hatch End community for authentic cuisine"
  },
  {
    year: "2017",
    title: "Excellence in Service Award",
    description: "Honored for consistently outstanding customer experience"
  },
  {
    year: "2021",
    title: "Sustainability Recognition",
    description: "Acknowledged for commitment to eco-friendly practices"
  },
  {
    year: "2023",
    title: "Community Choice Award",
    description: "Voted favorite family dining destination in Hatch End"
  }
]

export default function AboutPageClient() {
  return (
    <main className="bg-white text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/30 pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-48 h-48 md:w-96 md:h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6 lg:space-y-8 text-center lg:text-left"
            >
              <div className="space-y-4 lg:space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
                  <span className="text-xs sm:text-sm tracking-[0.3em] text-slate-600 font-medium uppercase">
                    Our Story
                  </span>
                </motion.div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                  <span className="block text-slate-900">About</span>
                  <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                    Dona Theresa
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Where authentic Italian culinary traditions meet the warmth of Portuguese hospitality, creating an unforgettable dining experience in the heart of Hatch End.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Hatch End, London</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Established 2011</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative order-first lg:order-last"
            >
              <div className="relative group">
                <div className="absolute -inset-4 md:-inset-8 bg-gradient-to-r from-amber-200/30 to-yellow-200/20 rounded-full blur-3xl group-hover:blur-[4rem] transition-all duration-500" />
                <div className="relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-slate-200/50">
                  <Image
                    src="/gallery-interior.png"
                    alt="Dona Theresa Restaurant Interior - Elegant dining atmosphere"
                    width={500}
                    height={600}
                    className="rounded-xl md:rounded-2xl object-cover w-full shadow-lg"
                    priority
                  />
                  
                  <div className="mt-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Authentic Italian Dining</h2>
                    <p className="text-amber-600 font-semibold mb-3">Since 2011</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4 text-amber-500" />
                        Portuguese Heritage
                      </span>
                      <span className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4 text-amber-500" />
                        Italian Excellence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <div className="p-3 md:p-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl md:rounded-2xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-slate-600 font-semibold text-sm md:text-base">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Story Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-slate-900">
              A Heritage of 
              <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Culinary Excellence
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Dona Theresa represents the perfect fusion of Italian culinary mastery and Portuguese hospitality traditions, 
              creating a unique dining experience that has become a cornerstone of Hatch End's restaurant scene.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200/50">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">The Portuguese Touch</h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Our restaurant brings the legendary Portuguese tradition of hospitality to Italian dining. 
                  This unique combination creates an atmosphere where every guest feels like family, 
                  experiencing the warmth and genuine care that defines Portuguese culture.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  From the moment you enter, you'll feel the difference - a welcoming ambiance that transforms 
                  a meal into a memorable experience, where attention to detail and personal service are paramount.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 md:p-10 shadow-xl border border-amber-200/50">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Italian Culinary Mastery</h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Our kitchen honors Italy's rich culinary heritage through traditional recipes passed down through generations. 
                  Every dish is crafted with authentic techniques and premium ingredients sourced directly from Italian suppliers.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  From hand-rolled pasta to wood-fired specialties, we maintain the highest standards of Italian cuisine, 
                  ensuring each plate tells a story of tradition, quality, and passion for authentic flavors.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Restaurant Features Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/gallery-dining.png"
                alt="Dona Theresa dining room - Elegant atmosphere for Italian cuisine"
                width={1200}
                height={600}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-3xl">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">A Dining Experience Like No Other</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Our restaurant combines elegant ambiance with warm hospitality, creating the perfect setting 
                    for intimate dinners, family celebrations, and memorable gatherings with friends.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed flex-grow">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-slate-900">
              Our Journey Through
              <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                The Years
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From our opening in 2011 to becoming Hatch End's premier Italian dining destination, 
              every milestone reflects our commitment to excellence and community.
            </p>
          </motion.div>

          {/* Mobile Timeline */}
          <div className="block lg:hidden space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-black">
                      {item.year}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-400 rounded-full" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                    <div className="text-2xl font-black bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent mb-4">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-4 border-white shadow-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                  Located in the Heart of
                  <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                    Hatch End
                  </span>
                </h2>
                
                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                  Since 2011, Dona Theresa has been proud to serve the vibrant community of Hatch End. 
                  Our location on Uxbridge Road makes us easily accessible while maintaining the intimate, 
                  neighborhood restaurant atmosphere our guests love.
                </p>
                
                <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                  We've become more than just a restaurant – we're a gathering place where locals celebrate 
                  life's special moments, where business lunches turn into lasting partnerships, and where 
                  first dates become anniversary traditions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-900 font-semibold">451 Uxbridge Road</p>
                    <p className="text-slate-600 text-sm">Hatch End, Pinner HA5 4JR</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-900 font-semibold">Tuesday - Sunday</p>
                    <p className="text-slate-600 text-sm">Lunch: 12:00 - 15:00 | Dinner: 18:00 - 22:30</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-900 font-semibold">Easy Access</p>
                    <p className="text-slate-600 text-sm">5 min walk from Hatch End station</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/gallery-exterior.png"
                  alt="Dona Theresa restaurant exterior on Uxbridge Road, Hatch End"
                  width={600}
                  height={400}
                  className="w-full h-[250px] md:h-[350px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="font-bold text-slate-900">Your Local Italian</h4>
                    <p className="text-slate-600 text-sm">Serving Hatch End with pride since 2011</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Recognition & Awards</h3>
                
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.year}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">
                          {achievement.year}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-slate-900 mb-2">{achievement.title}</h4>
                          <p className="text-slate-600 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-yellow-100/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-100/15 to-amber-100/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 px-6 py-3 rounded-full text-sm font-medium">
                  <Heart className="w-4 h-4 text-amber-600" />
                  <span className="tracking-[0.2em] uppercase">Experience Excellence</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Discover Authentic
                  <span className="block bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    Italian Cuisine
                  </span>
                </h2>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                  Join us for an unforgettable dining experience where every dish tells a story 
                  of tradition, quality, and passion. Reserve your table today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Link 
                  href="/reserve"
                  className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-2xl inline-flex items-center justify-center"
                >
                  <span>Reserve Your Table</span>
                  <Utensils className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/menu"
                  className="group w-full sm:w-auto border-2 border-slate-300 hover:border-amber-400 text-slate-700 hover:text-amber-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-amber-50 inline-flex items-center justify-center"
                >
                  <span>View Our Menu</span>
                  <Wine className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
} 