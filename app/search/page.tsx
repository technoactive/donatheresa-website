import { redirect } from 'next/navigation'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q?.toLowerCase() || ''

  // Simple redirect logic based on common search terms
  if (query.includes('menu') || query.includes('food')) {
    redirect('/menu')
  } else if (query.includes('book') || query.includes('reserv')) {
    redirect('/reserve')
  } else if (query.includes('contact') || query.includes('phone') || query.includes('address')) {
    redirect('/contact')
  } else if (query.includes('about') || query.includes('story')) {
    redirect('/about')
  } else if (query.includes('lunch')) {
    redirect('/menu/lunchtime-earlybird')
  } else if (query.includes('christmas')) {
    redirect('/menu/december-christmas-menu')
  } else {
    // If no match, redirect to homepage
    redirect('/')
  }
}
