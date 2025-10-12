'use client'

import { usePathname } from 'next/navigation'

export function BreadcrumbSchema() {
  const pathname = usePathname()
  
  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://donatheresa.com"
      }
    ]
    
    if (pathname === '/menu') {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Menu",
        "item": "https://donatheresa.com/menu"
      })
    } else if (pathname === '/about') {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": "https://donatheresa.com/about"
      })
    } else if (pathname === '/contact') {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": "https://donatheresa.com/contact"
      })
    } else if (pathname === '/reserve') {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Reservations",
        "item": "https://donatheresa.com/reserve"
      })
    } else if (pathname.startsWith('/menu/')) {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Menu",
        "item": "https://donatheresa.com/menu"
      })
      
      // Add specific menu section if applicable
      const menuSection = pathname.split('/').pop()
      if (menuSection) {
        const sectionNames: Record<string, string> = {
          'lunch': 'Lunch Menu',
          'dinner': 'Dinner Menu',
          'wine': 'Wine List',
          'desserts': 'Desserts'
        }
        
        if (sectionNames[menuSection]) {
          items.push({
            "@type": "ListItem",
            "position": 3,
            "name": sectionNames[menuSection],
            "item": `https://donatheresa.com/menu/${menuSection}`
          })
        }
      }
    }
    
    return items
  }
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": getBreadcrumbItems()
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema)
      }}
    />
  )
}
