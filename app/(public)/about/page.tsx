"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Award, Users, Calendar, Crown, Building, Star, Heart, Utensils, MapPin, Clock } from "lucide-react"

const stats = [
  { icon: Calendar, number: "13+", label: "Years in Hatch End" },
  { icon: Award, number: "25+", label: "Years Experience" },
  { icon: Users, number: "15K+", label: "Happy Guests" },
  { icon: Star, number: "4.9", label: "Average Rating" }
]

const timeline = [
  {
    year: "1990s",
    title: "The Portuguese Beginning",
    description: "Manuel and Ana meet in Portugal, sharing a passion for authentic cuisine and warm hospitality. Their love story begins with dreams of creating something special together."
  },
  {
    year: "2000s",
    title: "Italian Food Market Experience", 
    description: "The couple spends years working in the Italian food market, Manuel building supplier relationships while Ana focuses on authentic recipes and customer service excellence."
  },
  {
    year: "2011",
    title: "Dona Theresa is Born",
    description: "Manuel and Ana bring their shared dream to life, opening Dona Theresa in Hatch End. Named after Ana's grandmother, the restaurant embodies their family values and Portuguese warmth."
  },
  {
    year: "2015",
    title: "Community Recognition", 
    description: "The family restaurant becomes a beloved local institution, with Manuel and Ana known personally by many regular customers who feel like extended family."
  },
  {
    year: "2020",
    title: "Family Resilience",
    description: "During challenging times, Manuel and Ana adapt together, their strong partnership and family values helping them maintain the quality that makes Dona Theresa special."
  },
  {
    year: "2024",
    title: "Family Legacy Continues",
    description: "Today, Dona Theresa stands as a testament to Manuel and Ana's shared vision - a true family business combining Portuguese hospitality with Italian culinary excellence."
  }
]

const values = [
  {
    icon: Heart,
    title: "Family Passion",
    description: "Every aspect reflects Manuel and Ana's genuine love for Italian cuisine and Portuguese hospitality traditions, shared as a family."
  },
  {
    icon: Crown,  
    title: "Quality Excellence",
    description: "As a family business, we never compromise on ingredients, with Manuel and Ana personally ensuring the finest selection for our kitchen."
  },
  {
    icon: Users,
    title: "Community Family",
    description: "Hatch End is our home, and Manuel and Ana are proud to serve our neighbors with the warmth of Portuguese family hospitality."
  },
  {
    icon: Building,
    title: "Italian Tradition", 
    description: "Honoring authentic Italian culinary traditions through carefully selected dishes, with Ana's touch and Manuel's business expertise."
  }
]

const achievements = [
  {
    year: "2013",
    title: "Local Favorite Award",
    description: "Recognized as Hatch End's favorite family-run Italian restaurant"
  },
  {
    year: "2017", 
    title: "Excellence in Family Service",
    description: "Awarded for outstanding customer service and community contribution as a family business"
  },
  {
    year: "2021",
    title: "Sustainable Family Practices",
    description: "Recognized for commitment to local sourcing and sustainable family business practices"
  },
  {
    year: "2023",
    title: "Family Business Innovation",
    description: "Acknowledged for maintaining family traditions while embracing modern restaurant practices"
  }
]

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/30" style={{ minHeight: 'calc(100vh - 80px)', marginTop: '80px' }}>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 md:top-20 md:left-20 w-64 h-64 md:w-96 md:h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-r from-amber-100/10 to-slate-100/10 rounded-full blur-3xl"></div>
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
                  <div className="w-6 h-px md:w-8 md:h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
                  <span className="text-xs sm:text-sm tracking-[0.3em] text-slate-600 font-medium">
                    FAMILY STORY
                  </span>
                </motion.div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                  <span className="block text-slate-900">About</span>
                  <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                    Dona Theresa
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  A Portuguese family's dream brought to life - Manuel and Ana's authentic Italian dining experience in the heart of Hatch End since 2011.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <span className="font-medium text-sm sm:text-base">Hatch End, London</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <span className="font-medium text-sm sm:text-base">Family Business Since 2011</span>
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
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=600&fit=crop&crop=center"
                    alt="Manuel and Ana - Owners & Founders"
                    width={500}
                    height={600}
                    className="rounded-xl md:rounded-2xl object-cover w-full shadow-lg"
                  />
                  
                  <div className="mt-4 md:mt-6 text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Manuel & Ana</h3>
                    <p className="text-amber-600 font-semibold mb-2 text-sm md:text-base">Owners & Founders</p>
                    <div className="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Crown className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                        Portuguese Family
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                        Family Business
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <div className="p-2 md:p-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl md:rounded-2xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <stat.icon className="w-4 h-4 md:w-8 md:h-8" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-4xl font-black text-slate-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-semibold text-xs md:text-base">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Story Section */}
      <section className="py-16 md:py-32 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-8 text-slate-900">
              The Family 
              <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed px-4">
              From the sun-soaked shores of Portugal to the bustling Italian food markets, 
              Manuel and Ana's journey is one of love, partnership, and the shared pursuit of creating authentic dining experiences together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8"
            >
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl border border-slate-200/50">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">The Portuguese Love Story</h3>
                <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                  Manuel and Ana's story begins in Portugal, where they met and fell in love. Both grew up surrounded by the rich hospitality traditions of their homeland, 
                  learning the importance of warmth, genuine service, and creating memorable experiences for guests.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Their shared passion for authentic cuisine and exceptional hospitality became the foundation of their partnership, 
                  both in life and in their dream of opening a family restaurant that would bring Portuguese warmth to Italian dining.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8"
            >
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl border border-amber-200/50">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Family Business in Italian Markets</h3>
                <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                  Together, Manuel and Ana spent many years immersed in the Italian food market, with Manuel building relationships with suppliers 
                  while Ana focused on understanding authentic ingredients and perfecting the art of Italian hospitality.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  This deep family understanding of Italian food culture, combined with their Portuguese souls for hospitality, 
                  created the unique family vision that would define Dona Theresa's distinctive character.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Restaurant Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-20"
          >
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop&crop=center"
                alt="Elegant restaurant interior at Dona Theresa"
                width={1200}
                height={600}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">Dona Theresa Family Restaurant</h3>
                  <p className="text-slate-600 text-sm md:text-base">Where Portuguese family hospitality meets Italian culinary excellence</p>
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
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <div className="p-3 md:p-4 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-8 text-slate-900">
              Our Family 
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Timeline
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              The remarkable family journey that led Manuel and Ana to create Hatch End's beloved Italian family restaurant
            </p>
          </motion.div>

          {/* Mobile Timeline - Stack vertically */}
          <div className="block md:hidden space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-5 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-black">
                      {item.year}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Timeline - Alternating layout */}
          <div className="hidden md:block relative">
            {/* Timeline Line */}
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
                
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-4 border-white shadow-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hatch End Section */}
      <section className="py-16 md:py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8 text-center lg:text-left"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                Heart of
                <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  Hatch End
                </span>
              </h2>
              
              <div className="space-y-4 md:space-y-6">
                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                  In 2011, Manuel and Ana brought their shared dream to life in the charming community of Hatch End. 
                  They chose this location not just for its proximity to London, but for its warm, 
                  village-like atmosphere that reminded them of home.
                </p>
                
                <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                  Today, Dona Theresa stands as more than just a restaurant—it's a family gathering place 
                  where neighbors become friends, celebrations are shared, and the authentic 
                  flavors of Italy meet the genuine warmth of Portuguese family hospitality.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4 md:pt-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <span className="text-slate-700 font-semibold text-sm sm:text-base">451 Uxbridge Road</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <span className="text-slate-700 font-semibold text-sm sm:text-base">Tue-Sun</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8"
            >
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&crop=center"
                  alt="Hatch End neighborhood where Dona Theresa is located"
                  width={600}
                  height={400}
                  className="w-full h-48 md:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">Hatch End Village</h4>
                    <p className="text-slate-600 text-xs md:text-sm">Our family's home since 2011</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 text-center lg:text-left">Family Recognition & Achievements</h3>
                
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.year}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold flex-shrink-0">
                          {achievement.year}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1 md:mb-2 text-sm md:text-base">{achievement.title}</h4>
                          <p className="text-slate-600 text-xs md:text-sm">{achievement.description}</p>
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
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        {/* Subtle Background Elements */}
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
                  <span className="tracking-[0.2em] uppercase">Ready to Dine?</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight pb-2">
                  Experience Manuel & Ana's
                  <span className="block bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    Family Restaurant
                  </span>
                </h2>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                  Join us for an authentic Italian dining experience, created with Portuguese family passion 
                  and served with the warmth that makes Hatch End feel like home.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-2xl">
                  <span>Reserve Your Table</span>
                  <Utensils className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group w-full sm:w-auto border-2 border-slate-300 hover:border-amber-400 text-slate-700 hover:text-amber-600 px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-amber-50">
                  <span>View Our Menu</span>
                  <Crown className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
} 