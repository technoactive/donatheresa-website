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
    console.log('🔄 Setting up real-time notifications...');
    
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
            console.log('🆕 New booking detected:', payload.new)
            
            const booking = payload.new as any
            
            // Skip notifications for bookings created through the dashboard
            // (they have a source field or were created by admin)
            if (booking.created_by === 'admin' || booking.source === 'dashboard') {
              console.log('⏭️ Skipping dashboard-created booking notification');
              return
            }

            // Get customer details for the notification
            const { data: customer, error: customerError } = await supabase
              .from('customers')
              .select('name, customer_segment')
              .eq('id', booking.customer_id)
              .single()

            if (customerError) {
              console.error('❌ Failed to get customer details:', customerError);
              return;
            }

            if (!customer) {
              console.warn('⚠️ No customer found for booking:', booking.customer_id);
              return;
            }

            console.log('👤 Customer details:', customer);

            // Determine if this is a VIP customer
            const isVip = customer.customer_segment === 'VIP'
            
            // Determine if this is peak time (6-9 PM)
            const bookingHour = new Date(`2000-01-01T${booking.booking_time}`).getHours()
            const isPeakTime = bookingHour >= 18 && bookingHour <= 21

            // Format booking time for display
            const bookingDate = new Date(booking.booking_date).toLocaleDateString()
            const bookingTime = `${bookingDate} at ${booking.booking_time}`

            console.log('📅 Booking details:', {
              customer: customer.name,
              time: bookingTime,
              isVip,
              isPeakTime,
              partySize: booking.party_size
            });

            // Create the notification
            const notification = createBookingNotification(
              customer.name,
              bookingTime,
              booking.party_size,
              booking.id,
              isVip,
              isPeakTime
            )

            console.log('🔔 Creating notification:', notification);

            // Add notification to manager (it will check settings internally)
            const wasAdded = notificationManager.addNotification(notification)
            
            if (wasAdded) {
              console.log('✅ Notification added successfully');
              
              // Play sound if settings allow it
              if (notificationManager.shouldPlaySound(notification.type)) {
                const volume = notificationManager.getMasterVolume()
                console.log('🔊 Playing notification sound:', notification.type, 'volume:', volume);
                await playNotificationSound(notification.type, volume)
              } else {
                console.log('🔇 Sound disabled for notification type:', notification.type);
              }
            } else {
              console.log('❌ Notification was not added (disabled or filtered out)');
            }

          } catch (error) {
            console.error('💥 Error processing new booking notification:', error)
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
            console.log('📝 Booking updated:', payload.new)
            
            const oldBooking = payload.old as any
            const newBooking = payload.new as any
            
            // Skip notifications for dashboard updates
            if (newBooking.updated_by === 'admin') {
              console.log('⏭️ Skipping admin-updated booking notification');
              return
            }

            // Check if status changed to cancelled
            if (oldBooking.status !== 'cancelled' && newBooking.status === 'cancelled') {
              console.log('❌ Booking cancellation detected');
              
              // Get customer details
              const { data: customer } = await supabase
                .from('customers')
                .select('name')
                .eq('id', newBooking.customer_id)
                .single()

              if (!customer) {
                console.warn('⚠️ No customer found for cancelled booking');
                return;
              }

              // Format booking time for display
              const bookingDate = new Date(newBooking.booking_date).toLocaleDateString()
              const bookingTime = `${bookingDate} at ${newBooking.booking_time}`

              // Create cancellation notification
              const notification = createCancellationNotification(
                customer.name,
                bookingTime,
                newBooking.id
              )

              console.log('🔔 Creating cancellation notification:', notification);

              // Add notification to manager
              const wasAdded = notificationManager.addNotification(notification)
              
              if (wasAdded) {
                console.log('✅ Cancellation notification added');
                
                // Play sound if settings allow it
                if (notificationManager.shouldPlaySound(notification.type)) {
                  const volume = notificationManager.getMasterVolume()
                  await playNotificationSound(notification.type, volume)
                }
              }
            }
            
            // Check for other significant updates (time, date, party size changes)
            else if (
              oldBooking.booking_date !== newBooking.booking_date ||
              oldBooking.booking_time !== newBooking.booking_time ||
              oldBooking.party_size !== newBooking.party_size
            ) {
              console.log('✏️ Significant booking update detected');
              
              // Get customer details
              const { data: customer } = await supabase
                .from('customers')
                .select('name')
                .eq('id', newBooking.customer_id)
                .single()

              if (!customer) return

              // Format new booking time for display
              const bookingDate = new Date(newBooking.booking_date).toLocaleDateString()
              const bookingTime = `${bookingDate} at ${newBooking.booking_time}`

              // Create update notification
              const notification = {
                type: 'booking_updated' as const,
                title: 'Booking Updated',
                message: `${customer.name}'s reservation updated to ${bookingTime} (${newBooking.party_size} guests)`,
                priority: 'medium' as const,
                dismissed: false,
                data: {
                  customerName: customer.name,
                  bookingId: newBooking.id,
                  bookingTime
                },
                actionUrl: `/dashboard/bookings?highlight=${newBooking.id}`
              }

              console.log('🔔 Creating update notification:', notification);

              // Add notification to manager
              const wasAdded = notificationManager.addNotification(notification)
              
              if (wasAdded) {
                console.log('✅ Update notification added');
                
                // Play sound if settings allow it
                if (notificationManager.shouldPlaySound(notification.type)) {
                  const volume = notificationManager.getMasterVolume()
                  await playNotificationSound(notification.type, volume)
                }
              }
            }

          } catch (error) {
            console.error('💥 Error processing booking update notification:', error)
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status)
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time notifications are now active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription failed');
        } else if (status === 'TIMED_OUT') {
          console.warn('⏰ Real-time subscription timed out');
        } else if (status === 'CLOSED') {
          console.log('🔌 Real-time subscription closed');
        }
      })

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up real-time notifications...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [supabase])

  return <>{children}</>
} 