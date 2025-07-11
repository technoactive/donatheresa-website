// Enhanced notification sound system with fallbacks

export type NotificationSoundType = 'new_booking' | 'vip_booking' | 'booking_cancelled' | 'peak_time_booking' | 'system_alert'

// Fallback sound generators using Web Audio API
const generateBeep = (frequency: number, duration: number, volume: number = 0.3): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
      
      oscillator.onended = () => {
        audioContext.close()
        resolve()
      }
    } catch (error) {
      console.warn('Failed to generate beep:', error)
      resolve()
    }
  })
}

// Sound configurations
const soundConfigs = {
  new_booking: {
    file: '/sounds/new-booking.mp3',
    fallback: () => generateBeep(800, 0.3) // Pleasant high tone
  },
  vip_booking: {
    file: '/sounds/vip-booking.mp3', 
    fallback: async () => {
      // Two-tone chime for VIP
      await generateBeep(800, 0.2)
      await new Promise(r => setTimeout(r, 50))
      await generateBeep(1000, 0.3)
    }
  },
  booking_cancelled: {
    file: '/sounds/booking-cancelled.mp3',
    fallback: () => generateBeep(400, 0.5) // Lower tone for cancellation
  },
  peak_time_booking: {
    file: '/sounds/peak-time.mp3',
    fallback: () => generateBeep(600, 0.4) // Medium tone
  },
  system_alert: {
    file: '/sounds/system-alert.mp3',
    fallback: async () => {
      // Three quick beeps for alerts
      await generateBeep(1000, 0.15)
      await new Promise(r => setTimeout(r, 100))
      await generateBeep(1000, 0.15)
      await new Promise(r => setTimeout(r, 100))
      await generateBeep(1000, 0.15)
    }
  }
}

export const playNotificationSound = async (type: NotificationSoundType, volume: number = 0.3): Promise<void> => {
  if (typeof window === 'undefined') return

  const config = soundConfigs[type]
  if (!config) return

  try {
    // Try to play the audio file first
    const audio = new Audio(config.file)
    audio.volume = Math.min(Math.max(volume, 0), 1) // Clamp volume between 0 and 1
    
    await new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => {
        audio.play().then(resolve).catch(reject)
      }
      audio.onerror = reject
      
      // Timeout after 1 second to fallback
      setTimeout(() => reject(new Error('Audio load timeout')), 1000)
    })
    
    console.log(`🔊 Played sound file for ${type}`)
  } catch (error) {
    console.log(`🔄 Sound file failed for ${type}, using fallback`)
    
    // Use fallback sound generator
    try {
      await config.fallback()
      console.log(`🔊 Played fallback sound for ${type}`)
    } catch (fallbackError) {
      console.warn(`❌ Failed to play fallback sound for ${type}:`, fallbackError)
    }
  }
}

export const testNotificationSound = async (type: NotificationSoundType, volume: number = 0.3): Promise<void> => {
  console.log(`🧪 Testing sound: ${type}`)
  await playNotificationSound(type, volume)
}

export const testAllNotificationSounds = async (volume: number = 0.3): Promise<void> => {
  const types: NotificationSoundType[] = ['new_booking', 'vip_booking', 'booking_cancelled', 'peak_time_booking', 'system_alert']
  
  for (const type of types) {
    console.log(`🧪 Testing sound: ${type}`)
    await playNotificationSound(type, volume)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between sounds
  }
}

// Sound testing utilities for the notification demo
export const soundDescriptions = {
  new_booking: 'Pleasant ascending chime (C major chord)',
  vip_booking: 'Special fanfare sequence for VIP customers',
  booking_cancelled: 'Gentle descending tone',
  booking_updated: 'Simple two-tone notification',
  peak_time_booking: 'Urgent but pleasant sequence',
  customer_message: 'Soft single tone',
  system_alert: 'Attention-getting sequence'
} as const 