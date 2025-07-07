// Notification Sound System - Restaurant Industry Standards
// Provides audio feedback for booking notifications using Web Audio API

import type { NotificationType } from './notifications'

export type SoundType = 'new_booking' | 'vip_booking' | 'booking_cancelled' | 'peak_time' | 'system_alert'

interface SoundPattern {
  frequency: number
  duration: number
  volume: number
  pattern?: Array<{ freq: number; duration: number }>
}

// Restaurant industry sound patterns for different notification types
const SOUND_PATTERNS: Record<SoundType, SoundPattern> = {
  new_booking: {
    frequency: 800,
    duration: 300,
    volume: 0.3,
    pattern: [
      { freq: 800, duration: 100 },
      { freq: 0, duration: 50 },
      { freq: 1000, duration: 200 }
    ]
  },
  vip_booking: {
    frequency: 1200,
    duration: 500,
    volume: 0.4,
    pattern: [
      { freq: 1200, duration: 150 },
      { freq: 0, duration: 50 },
      { freq: 1400, duration: 150 },
      { freq: 0, duration: 50 },
      { freq: 1600, duration: 200 }
    ]
  },
  booking_cancelled: {
    frequency: 400,
    duration: 400,
    volume: 0.25,
    pattern: [
      { freq: 600, duration: 100 },
      { freq: 400, duration: 100 },
      { freq: 300, duration: 200 }
    ]
  },
  peak_time: {
    frequency: 900,
    duration: 250,
    volume: 0.2,
    pattern: [
      { freq: 900, duration: 125 },
      { freq: 1100, duration: 125 }
    ]
  },
  system_alert: {
    frequency: 1000,
    duration: 600,
    volume: 0.35,
    pattern: [
      { freq: 1000, duration: 200 },
      { freq: 0, duration: 100 },
      { freq: 1000, duration: 200 },
      { freq: 0, duration: 100 }
    ]
  }
}

class NotificationSoundManager {
  private audioContext: AudioContext | null = null
  private isInitialized = false

  private async initializeAudio(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize AudioContext on first user interaction
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.isInitialized = true
    } catch (error) {
      console.warn('Could not initialize audio context:', error)
    }
  }

  private async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
      } catch (error) {
        console.warn('Could not resume audio context:', error)
      }
    }
  }

  private async playTone(frequency: number, duration: number, volume: number = 0.3): Promise<void> {
    await this.initializeAudio()
    await this.resumeAudioContext()
    
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = 'sine'

      // Apply volume with smooth fade in/out
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01)
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration - 0.01)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (error) {
      console.warn('Error playing notification tone:', error)
    }
  }

  private async playSequence(frequencies: number[], volume: number = 0.3): Promise<void> {
    for (let i = 0; i < frequencies.length; i++) {
      await this.playTone(frequencies[i], 0.2, volume)
      if (i < frequencies.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }
  }

  public async playNotificationSound(type: NotificationType, volume: number = 0.3): Promise<void> {
    if (volume <= 0) return

    try {
      switch (type) {
        case 'new_booking':
          // Pleasant ascending chime - C major chord
          await this.playSequence([523.25, 659.25, 783.99], volume)
          break

        case 'vip_booking':
          // Special VIP sequence - Fanfare-like
          await this.playSequence([659.25, 783.99, 987.77, 1174.66], volume * 1.1)
          break

        case 'booking_cancelled':
          // Gentle descending tone
          await this.playSequence([783.99, 659.25, 523.25], volume * 0.8)
          break

        case 'booking_updated':
          // Simple two-tone notification
          await this.playSequence([659.25, 783.99], volume * 0.7)
          break

        case 'peak_time_booking':
          // Urgent but pleasant sequence
          await this.playSequence([523.25, 783.99, 523.25], volume)
          break

        case 'customer_message':
          // Soft single tone
          await this.playTone(659.25, 0.3, volume * 0.6)
          break

        case 'system_alert':
          // Attention-getting sequence
          await this.playSequence([880, 698.46, 880], volume)
          break

        default:
          // Default notification sound
          await this.playTone(659.25, 0.5, volume)
      }
    } catch (error) {
      console.warn('Error playing notification sound:', error)
      
      // Fallback to browser notification or vibration
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate(200)
        }
      } catch (vibrateError) {
        console.warn('Vibration not supported:', vibrateError)
      }
    }
  }

  public async testSound(type: NotificationType, volume: number = 0.3): Promise<void> {
    await this.playNotificationSound(type, volume)
  }

  public async testAllSounds(volume: number = 0.3): Promise<void> {
    const types: NotificationType[] = [
      'new_booking',
      'vip_booking', 
      'booking_cancelled',
      'booking_updated',
      'peak_time_booking',
      'customer_message',
      'system_alert'
    ]

    for (const type of types) {
      console.log(`Testing sound for: ${type}`)
      await this.playNotificationSound(type, volume)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between sounds
    }
  }
}

// Export singleton instance
const soundManager = new NotificationSoundManager()

export const playNotificationSound = (type: NotificationType, volume: number = 0.3) => 
  soundManager.playNotificationSound(type, volume)

export const testNotificationSound = (type: NotificationType, volume: number = 0.3) => 
  soundManager.testSound(type, volume)

export const testAllNotificationSounds = (volume: number = 0.3) => 
  soundManager.testAllSounds(volume)

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