"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Pause, Play, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const galleryImages = [
  { 
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop&crop=center", 
    alt: "Elegant restaurant interior with warm lighting",
    title: "Sophisticated Interior",
    subtitle: "Architectural Excellence",
    description: "Thoughtfully designed spaces that create the perfect ambiance for your dining experience.",
    tags: ["Interior", "Ambiance", "Luxury"],
    location: "Main Dining Room"
  },
  { 
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop&crop=center", 
    alt: "Chef plating an exquisite dish",
    title: "Culinary Artistry",
    subtitle: "Master Craftsmanship", 
    description: "Each plate is a masterpiece, crafted with precision and artistic flair.",
    tags: ["Fine Dining", "Artistry"],
    location: "Executive Kitchen"
  },
  { 
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=800&fit=crop&crop=center", 
    alt: "Elegant table setting with wine glasses",
    title: "Intimate Dining",
    subtitle: "Romantic Experience",
    description: "Every detail perfected to create memorable moments for you and your loved ones.",
    tags: ["Romance", "Excellence"],
    location: "Private Dining"
  },
  { 
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&crop=center", 
    alt: "Restaurant exterior at golden hour",
    title: "Welcoming Atmosphere",
    subtitle: "First Impressions",
    description: "Your culinary journey begins the moment you step through our doors.",
    tags: ["Exterior", "Welcome"],
    location: "Main Entrance"
  },
  { 
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop&crop=center", 
    alt: "Fine dining table setup with candles",
    title: "Romantic Ambiance",
    subtitle: "Special Moments",
    description: "Warm, inviting atmosphere designed to make every evening special.",
    tags: ["Romance", "Atmosphere"],
    location: "Terrace Dining"
  }
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
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    })
  }

  const currentImage = galleryImages[currentIndex]

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6">
      {/* Main Carousel */}
      <div className="relative h-[80vh] rounded-2xl overflow-hidden shadow-xl bg-slate-900">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.6,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            
            {/* Simple overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Info Card */}
        <div className="absolute bottom-8 left-8 right-8 md:right-auto md:max-w-lg">
          <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white">
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-white/80">5.0</span>
            </div>
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {currentImage.title}
            </h2>
            
            <p className="text-amber-300 text-lg mb-4">
              {currentImage.subtitle}
            </p>

            {/* Description */}
            <p className="text-white/90 mb-4 leading-relaxed">
              {currentImage.description}
            </p>

            {/* Tags & Location */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-2">
                {currentImage.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-white/20 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentImage.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 text-white rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 text-white rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={togglePlayPause}
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 text-white rounded-full transition-colors duration-200"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>

        {/* Counter */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl text-sm">
            {currentIndex + 1} / {galleryImages.length}
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative"
          >
            {/* Progress Track */}
            <div className="w-16 h-1 bg-slate-300 rounded-full overflow-hidden">
              <div
                className={`h-full bg-amber-500 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-full' : 'w-0'
                }`}
                style={{
                  transitionDuration: index === currentIndex && isPlaying ? '5000ms' : '300ms',
                  transitionTimingFunction: index === currentIndex ? 'linear' : 'ease'
                }}
              />
            </div>
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-slate-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
                {image.title}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-8 overflow-hidden">
        <div className="flex gap-3 justify-center overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 ${
                index === currentIndex 
                  ? 'ring-2 ring-amber-400 scale-105' 
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
              {index !== currentIndex && (
                <div className="absolute inset-0 bg-black/30" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
