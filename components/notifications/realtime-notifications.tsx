"use client"

import React, { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { notificationManager, createBookingNotification, createCancellationNotification } from '@/lib/notifications'
import { playNotificationSound } from '@/lib/notification-sounds'

interface RealtimeNotificationsProps {
  children?: React.ReactNode
}

export function RealtimeNotifications({ children }: RealtimeNotificationsProps) {
  const supabase = createClient()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    // Create a single channel for all booking changes
    channelRef.current = supabase
      .channel('booking_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        async (payload) => {
          try {
            console.log('New booking detected:', payload.new)
            
            const booking = payload.new as any
            
            // Skip notifications for bookings created through the dashboard
            // (they have a source field or were created by admin)
            if (booking.created_by === 'admin' || booking.source === 'dashboard') {
              return
            }

            // Get customer details for the notification
            const { data: customer } = await supabase
              .from('customers')
              .select('name, customer_segment')
              .eq('id', booking.customer_id)
              .single()

            if (!customer) return

            // Determine if this is a VIP customer
            const isVip = customer.customer_segment === 'VIP'
            
            // Determine if this is peak time (6-9 PM)
            const bookingHour = new Date(`2000-01-01T${booking.time}`).getHours()
            const isPeakTime = bookingHour >= 18 && bookingHour <= 21

            // Format booking time for display
            const bookingDate = new Date(booking.date).toLocaleDateString()
            const bookingTime = `${bookingDate} at ${booking.time}`

            // Create the notification
            const notification = createBookingNotification(
              customer.name,
              bookingTime,
              booking.party_size,
              booking.id,
              isVip,
              isPeakTime
            )

            // Add notification to manager (it will check settings internally)
            const wasAdded = notificationManager.addNotification(notification)
            
            if (wasAdded) {
              // Play sound if settings allow it
              if (notificationManager.shouldPlaySound(notification.type)) {
                const volume = notificationManager.getMasterVolume()
                await playNotificationSound(notification.type, volume)
              }
            }

          } catch (error) {
            console.error('Error processing new booking notification:', error)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
        },
        async (payload) => {
          try {
            console.log('Booking updated:', payload.new)
            
            const oldBooking = payload.old as any
            const newBooking = payload.new as any
            
            // Skip notifications for dashboard updates
            if (newBooking.updated_by === 'admin') {
              return
            }

            // Check if status changed to cancelled
            if (oldBooking.status !== 'cancelled' && newBooking.status === 'cancelled') {
              // Get customer details
              const { data: customer } = await supabase
                .from('customers')
                .select('name')
                .eq('id', newBooking.customer_id)
                .single()

              if (!customer) return

              // Format booking time for display
              const bookingDate = new Date(newBooking.date).toLocaleDateString()
              const bookingTime = `${bookingDate} at ${newBooking.time}`

              // Create cancellation notification
              const notification = createCancellationNotification(
                customer.name,
                bookingTime,
                newBooking.id
              )

              // Add notification to manager
              const wasAdded = notificationManager.addNotification(notification)
              
              if (wasAdded) {
                // Play sound if settings allow it
                if (notificationManager.shouldPlaySound(notification.type)) {
                  const volume = notificationManager.getMasterVolume()
                  await playNotificationSound(notification.type, volume)
                }
              }
            }
            
            // Check for other significant updates (time, date, party size changes)
            else if (
              oldBooking.date !== newBooking.date ||
              oldBooking.time !== newBooking.time ||
              oldBooking.party_size !== newBooking.party_size
            ) {
              // Get customer details
              const { data: customer } = await supabase
                .from('customers')
                .select('name')
                .eq('id', newBooking.customer_id)
                .single()

              if (!customer) return

              // Format new booking time for display
              const bookingDate = new Date(newBooking.date).toLocaleDateString()
              const bookingTime = `${bookingDate} at ${newBooking.time}`

              // Create update notification
              const notification = {
                type: 'booking_updated' as const,
                title: 'Booking Updated',
                message: `${customer.name}'s reservation updated to ${bookingTime} (${newBooking.party_size} guests)`,
                priority: 'medium' as const,
                customerName: customer.name,
                bookingId: newBooking.id,
                actionUrl: `/dashboard/bookings?highlight=${newBooking.id}`
              }

              // Add notification to manager
              const wasAdded = notificationManager.addNotification(notification)
              
              if (wasAdded) {
                // Play sound if settings allow it
                if (notificationManager.shouldPlaySound(notification.type)) {
                  const volume = notificationManager.getMasterVolume()
                  await playNotificationSound(notification.type, volume)
                }
              }
            }

          } catch (error) {
            console.error('Error processing booking update notification:', error)
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [supabase])

  return <>{children}</>
} 