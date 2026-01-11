'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const router = useRouter()
  const query = searchParams.q?.toLowerCase() || ''

  useEffect(() => {
    // Only redirect if there's a query parameter
    if (query) {
      // Simple redirect logic based on common search terms
      if (query.includes('menu') || query.includes('food')) {
        router.push('/menu')
      } else if (query.includes('book') || query.includes('reserv')) {
        router.push('/reserve')
      } else if (query.includes('contact') || query.includes('phone') || query.includes('address')) {
        router.push('/contact')
      } else if (query.includes('about') || query.includes('story')) {
        router.push('/about')
      } else if (query.includes('lunch')) {
        router.push('/menu/lunchtime-earlybird')
      } else if (query.includes('carte') || query.includes('dinner')) {
        router.push('/menu/a-la-carte')
      } else {
        // If no match, redirect to homepage
        router.push('/')
      }
    }
  }, [query, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Search</h1>
        {query ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-slate-600">Searching for "{query}"...</p>
          </div>
        ) : (
          <p className="text-slate-600">No search query provided.</p>
        )}
      </div>
    </div>
  )
}
