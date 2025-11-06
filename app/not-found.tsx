import { Metadata } from 'next'
import { NotFoundPageContent } from '@/components/not-found-page-content'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Dona Theresa Italian Restaurant',
  description: 'The page you are looking for could not be found. Browse our menu, make a reservation, or contact us.',
  robots: 'noindex, follow',
}

export default function NotFound() {
  return <NotFoundPageContent />
}
