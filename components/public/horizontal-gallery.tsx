"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const galleryImages = [
  { 
    src: "/gallery-interior.png", 
    alt: "Elegant interior design",
    title: "Sophisticated Interior",
    description: "Thoughtfully designed spaces that create the perfect ambiance for your dining experience."
  },
  { 
    src: "/gallery-wine.png", 
    alt: "Sommelier pouring red wine",
    title: "Expert Wine Selection",
    description: "Our sommelier curates an exceptional wine collection to complement every dish."
  },
  { 
    src: "/gallery-table-setting.png", 
    alt: "Perfectly set table for two",
    title: "Intimate Dining",
    description: "Every detail perfected to create memorable moments for you and your loved ones."
  },
  { 
    src: "/gallery-exterior.png", 
    alt: "Welcoming exterior at twilight",
    title: "Welcoming Entrance",
    description: "Your culinary journey begins the moment you step through our doors."
  },
  { 
    src: "/gallery-ambiance.png", 
    alt: "Cozy corner with plush seating",
    title: "Ambient Lighting",
    description: "Warm, inviting atmosphere designed to make every evening special."
  },
  { 
    src: "/gallery-plating.png", 
    alt: "Chef meticulously plating a dish",
    title: "Artful Presentation",
    description: "Each plate is a canvas where culinary artistry comes to life."
  },
  { 
    src: "/gallery-cocktail.png", 
    alt: "Craft cocktail being garnished",
    title: "Craft Cocktails",
    description: "Expertly crafted cocktails to perfectly complement your dining experience."
  },
]

export const HorizontalGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return
    
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [isPlaying])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    })
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Main Carousel */}
      <div className="relative h-[70vh] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].alt}
                fill
                className="object-cover"
                priority
              />
              {/* Sophisticated Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="max-w-2xl"
                >
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                    {galleryImages[currentIndex].title}
                  </h3>
                  <p className="text-lg md:text-xl text-zinc-200 leading-relaxed">
                    {galleryImages[currentIndex].description}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-black/20 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-black/20 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute top-6 right-6">
          <Button
            onClick={togglePlayPause}
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-black/20 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white rounded-full transition-all duration-300"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Modern Progress Indicators */}
      <div className="flex justify-center items-center gap-3 mt-8">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative"
          >
            {/* Background Track */}
            <div className="w-16 h-1 bg-zinc-700 rounded-full overflow-hidden">
              {/* Progress Fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ 
                  width: index === currentIndex ? "100%" : "0%"
                }}
                transition={{ 
                  duration: index === currentIndex && isPlaying ? 5 : 0.3,
                  ease: "linear"
                }}
              />
            </div>
            
            {/* Hover Label */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {galleryImages[index].title}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-8 overflow-hidden">
        <div className="flex gap-4 justify-center">
          {galleryImages.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                index === currentIndex 
                  ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-black scale-110' 
                  : 'hover:scale-105 opacity-60 hover:opacity-80'
              }`}
              whileHover={{ scale: index === currentIndex ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
              {/* Active Indicator */}
              {index === currentIndex && (
                <motion.div
                  layoutId="activeThumb"
                  className="absolute inset-0 bg-gradient-to-t from-green-600/40 to-transparent"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
