"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Award, Users, Calendar, Crown, ChefHat, Star, Heart, Utensils } from "lucide-react"

const stats = [
  { icon: Calendar, number: "15+", label: "Years Experience" },
  { icon: Award, number: "12", label: "Awards Won" },
  { icon: Users, number: "25K+", label: "Happy Guests" },
  { icon: Star, number: "4.9", label: "Average Rating" }
]

const chefs = [
  {
    name: "Marco Benedetti",
    role: "Executive Chef",
    bio: "With over 20 years of culinary excellence, Marco brings authentic Italian tradition to every dish.",
    image: "/story-owner.png",
    specialties: ["Traditional Italian", "Modern Fusion", "Wine Pairing"],
    awards: ["Michelin Recognition", "James Beard Nominee", "Best Chef 2023"]
  },
  {
    name: "Isabella Romano",
    role: "Pastry Chef",  
    bio: "Isabella's desserts are works of art that perfectly balance innovation with classic Italian sweetness.",
    image: "/placeholder-user.jpg",
    specialties: ["Artisan Desserts", "Gelato Making", "Chocolate Work"],
    awards: ["World Pastry Champion", "Best Dessert Menu", "Innovation Award"]
  },
  {
    name: "Giuseppe Marino",
    role: "Sous Chef",
    bio: "Giuseppe ensures every dish meets our exacting standards with precision and passion.",
    image: "/placeholder-user.jpg", 
    specialties: ["Seafood Cuisine", "Fresh Pasta", "Regional Specialties"],
    awards: ["Rising Star Chef", "Excellence Award", "Culinary Innovation"]
  }
]

const timeline = [
  {
    year: "2009",
    title: "The Beginning",
    description: "Marco Benedetti opens Dona Theresa with a vision to bring authentic Italian cuisine to the heart of the city."
  },
  {
    year: "2012",
    title: "First Recognition", 
    description: "Awarded 'Best New Restaurant' and featured in Food & Wine Magazine for our innovative approach to Italian classics."
  },
  {
    year: "2015",
    title: "Culinary Excellence",
    description: "Received our first Michelin recognition and expanded our team with world-class culinary talent."
  },
  {
    year: "2018",
    title: "Expansion & Innovation",
    description: "Renovated our space to create a more intimate dining experience and launched our Chef's Table program."
  },
  {
    year: "2023",
    title: "Modern Era",
    description: "Embracing sustainable practices and contemporary techniques while honoring our Italian heritage."
  }
]

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "Every dish is crafted with love and dedication to the art of cooking."
  },
  {
    icon: Crown,  
    title: "Excellence",
    description: "We never compromise on quality, from ingredients to service."
  },
  {
    icon: Users,
    title: "Community",
    description: "Building connections through shared meals and memorable experiences."
  },
  {
    icon: Utensils,
    title: "Tradition", 
    description: "Honoring authentic Italian culinary traditions with modern innovation."
  }
]

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ minHeight: 'calc(100vh - 80px)', marginTop: '80px' }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black z-10" />
          <Image
            src="/story-image.png"
            alt="Restaurant story"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        {/* Interactive Elements */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-2xl" />
        </div>

        <div className="relative z-30 max-w-7xl mx-auto px-6 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-3"
              >
                <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
                <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                  OUR STORY
                </span>
                <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
              </motion.div>
              
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-none tracking-tight">
                <span className="block text-white">ABOUT</span>
                <span className="block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  US
                </span>
              </h1>
              
              <p className="text-xl text-zinc-300 font-light leading-relaxed max-w-3xl mx-auto">
                A culinary journey that began with passion, grew through dedication, 
                and continues to evolve with every guest we serve.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl rounded-3xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-500 hover:scale-105">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl text-white group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-zinc-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  <span className="text-white">Our</span>
                  <span className="block bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                    Core Values
                  </span>
                </h2>
                <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                  Founded in 2009 by Executive Chef Marco Benedetti, Dona Theresa was born from a simple yet profound vision: 
                  to create a dining experience that honors the rich traditions of Italian cuisine while embracing modern culinary innovation.
                </p>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Named after Marco's grandmother, who taught him the secrets of authentic Italian cooking, 
                  our restaurant has become a beacon of culinary excellence in the heart of the city.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="p-3 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-xl w-fit mx-auto mb-3 border border-amber-400/30">
                      <value.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-white font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-zinc-400">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300" />
                <Image
                  src="/story-owner.png"
                  alt="Chef Marco Benedetti"
                  width={600}
                  height={700}
                  className="relative rounded-2xl object-cover w-full shadow-2xl"
                />
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-2">Marco Benedetti</h3>
                    <p className="text-zinc-300 mb-3">Executive Chef & Founder</p>
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      <span className="text-sm text-zinc-300">15+ Years of Excellence</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                Our Story
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              A journey of culinary evolution and continuous excellence
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-amber-500 via-yellow-500 to-amber-500" />
            
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
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50">
                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-zinc-400">{item.description}</p>
                  </div>
                </div>
                
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-4 border-black" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Team Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                Our Chef
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              The talented individuals who bring our culinary vision to life
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {chefs.map((chef, index) => (
              <motion.div
                key={chef.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-zinc-700/50 hover:border-zinc-600 transition-all duration-500 hover:scale-105">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={chef.image}
                      alt={chef.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <ChefHat className="w-6 h-6 text-amber-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">{chef.name}</h3>
                        <p className="text-amber-400 font-medium">{chef.role}</p>
                      </div>
                    </div>
                    
                    <p className="text-zinc-400 mb-6 leading-relaxed">{chef.bio}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-zinc-500 mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-2">
                          {chef.specialties.map((specialty, i) => (
                            <span key={i} className="px-3 py-1 bg-amber-600/20 text-amber-300 rounded-full text-sm border border-amber-400/30">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-zinc-500 mb-2">Awards</p>
                        <div className="flex flex-wrap gap-2">
                          {chef.awards.map((award, i) => (
                            <span key={i} className="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-sm border border-yellow-400/30">
                              {award}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 