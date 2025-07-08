"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle mounting
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('sidebar-collapsed')
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error)
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
      } catch (error) {
        console.error('Error saving sidebar state:', error)
      }
    }
  }, [isCollapsed, mounted])

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev)
  }
  const collapseSidebar = () => setIsCollapsed(true)
  const expandSidebar = () => setIsCollapsed(false)

  const value = {
    isCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    console.warn('useSidebar must be used within a SidebarProvider')
    // Return a default context instead of throwing
    return {
      isCollapsed: false,
      toggleSidebar: () => {},
      collapseSidebar: () => {},
      expandSidebar: () => {},
    }
  }
  return context
} 