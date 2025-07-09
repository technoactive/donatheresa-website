"use client"

import { useState, useEffect } from 'react'

interface iPadDetectionResult {
  isIPad: boolean
  isLandscape: boolean
  screenWidth: number
  screenHeight: number
  keyboardVisible: boolean
  availableHeight: number
}

export function useIPadDetection(): iPadDetectionResult {
  const [detection, setDetection] = useState<iPadDetectionResult>({
    isIPad: false,
    isLandscape: false,
    screenWidth: 0,
    screenHeight: 0,
    keyboardVisible: false,
    availableHeight: 0,
  })

  useEffect(() => {
    // Function to detect iPad
    const detectIPad = (): boolean => {
      const userAgent = navigator.userAgent.toLowerCase()
      const platform = navigator.platform?.toLowerCase() || ''
      
      // Check for iPad in user agent (works for older iPads)
      if (userAgent.includes('ipad')) return true
      
      // Check for iPad Pro (which reports as Mac in some cases)
      if (platform.includes('macintel') && navigator.maxTouchPoints > 1) return true
      
      // Check screen dimensions typical of iPads
      const { innerWidth, innerHeight } = window
      const minDimension = Math.min(innerWidth, innerHeight)
      const maxDimension = Math.max(innerWidth, innerHeight)
      
      // iPad dimensions (accounting for different models)
      const isIPadDimensions = (
        (minDimension >= 768 && maxDimension >= 1024) && // iPad standard
        (minDimension <= 1024 && maxDimension <= 1366)   // iPad Pro 12.9"
      )
      
      // Additional check: touch device with tablet-like dimensions
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      return isIPadDimensions && isTouchDevice
    }

    // Function to detect screen orientation
    const detectOrientation = (): boolean => {
      const { innerWidth, innerHeight } = window
      return innerWidth > innerHeight
    }

    // Function to detect keyboard visibility
    const detectKeyboard = (): { visible: boolean; availableHeight: number } => {
      const initialHeight = window.screen.height
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const heightDifference = initialHeight - currentHeight
      
      // Consider keyboard visible if height reduced by more than 150px
      const keyboardVisible = heightDifference > 150
      
      return {
        visible: keyboardVisible,
        availableHeight: currentHeight
      }
    }

    // Update detection state
    const updateDetection = () => {
      const keyboardInfo = detectKeyboard()
      
      setDetection({
        isIPad: detectIPad(),
        isLandscape: detectOrientation(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        keyboardVisible: keyboardInfo.visible,
        availableHeight: keyboardInfo.availableHeight,
      })
    }

    // Initial detection
    updateDetection()

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated
      setTimeout(updateDetection, 100)
    }

    // Listen for viewport changes (keyboard show/hide)
    const handleViewportChange = () => {
      updateDetection()
    }

    // Listen for window resize
    const handleResize = () => {
      updateDetection()
    }

    // Add event listeners
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleResize)
    
    // Visual viewport is better for keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
    }

    // Cleanup
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleResize)
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
      }
    }
  }, [])

  return detection
}

// Additional utility hook for iPad-specific optimizations
export function useIPadOptimizations() {
  const detection = useIPadDetection()
  
  const shouldUseIPadLayout = detection.isIPad && (
    detection.isLandscape || 
    detection.screenWidth >= 768
  )
  
  const formHeight = detection.keyboardVisible 
    ? detection.availableHeight - 100 // Account for navigation bars
    : '85vh'
  
  const touchTargetSize = detection.isIPad ? 44 : 36
  const fontSize = detection.isIPad ? 16 : 14
  const spacing = detection.isIPad ? 'lg' : 'md'
  
  return {
    ...detection,
    shouldUseIPadLayout,
    formHeight,
    touchTargetSize,
    fontSize,
    spacing,
    // CSS classes for conditional styling
    containerClasses: shouldUseIPadLayout ? 'ipad-optimized ipad-scroll' : '',
    inputClasses: detection.isIPad ? 'ipad-input ipad-touch-target' : '',
    buttonClasses: detection.isIPad ? 'ipad-button ipad-touch-target' : '',
    modalClasses: shouldUseIPadLayout ? 'ipad-modal' : '',
  }
}

// Utility function to get optimal column count based on screen size and orientation
export function getOptimalColumns(detection: iPadDetectionResult): number {
  if (!detection.isIPad) return 1
  
  if (detection.isLandscape && detection.screenWidth >= 1024) {
    return 2 // Two columns for landscape iPad
  } else if (detection.screenWidth >= 768) {
    return 1 // Single column for portrait or smaller screens
  }
  
  return 1
} 