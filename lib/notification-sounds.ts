// Enhanced notification sound system with fallbacks

export type NotificationSoundType = 'new_booking' | 'vip_booking' | 'booking_cancelled' | 'peak_time_booking' | 'system_alert'

// Fallback sound generators using Web Audio API
const generateBeep = (frequency: number, duration: number, volume: number = 0.3): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      console.log('🔇 No window object, skipping sound')
      resolve()
      return
    }

    try {
      console.log(`🎵 Generating beep: ${frequency}Hz for ${duration}s at volume ${volume}`)
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) {
        console.warn('❌ Web Audio API not supported')
        resolve()
        return
      }

      const audioContext = new AudioContextClass()
      
      // Resume context if suspended (required by many browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('🔊 Audio context resumed')
          playBeep()
        }).catch((resumeError) => {
          console.warn('❌ Failed to resume audio context:', resumeError)
          resolve()
        })
      } else {
        playBeep()
      }

      function playBeep() {
        try {
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
            audioContext.close().then(() => {
              console.log('✅ Beep played successfully')
              resolve()
            }).catch(() => {
              console.log('✅ Beep played (context cleanup failed)')
              resolve()
            })
          }
        } catch (playError) {
          console.warn('❌ Error during beep playback:', playError)
          audioContext.close().catch(() => {})
          resolve()
        }
      }
    } catch (error) {
      console.warn('❌ Failed to create audio context:', error)
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

  console.log(`🔊 Attempting to play sound for ${type}`)

  // Skip file loading and go straight to fallback for now
  // (since we know files don't exist)
  try {
    console.log(`🔄 Using fallback sound for ${type}`)
    await config.fallback()
    console.log(`✅ Played fallback sound for ${type}`)
  } catch (fallbackError) {
    console.warn(`❌ Failed to play fallback sound for ${type}:`, fallbackError)
    
    // Last resort: simple beep
    try {
      await generateBeep(800, 0.3, volume)
      console.log(`🔔 Played simple beep as last resort`)
    } catch (finalError) {
      console.warn(`❌ All sound methods failed:`, finalError)
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