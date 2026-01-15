import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Valentine's Day Menu 2026 | Romantic Italian Dinner | Dona Theresa",
  description: "💕 Valentine's Day at Dona Theresa! £39.95pp • Romantic 3-course dinner • Candlelit atmosphere. Book now ☎️ 020 8421 5550",
  keywords: [
    "valentines day dinner pinner",
    "valentines day restaurant hatch end",
    "romantic restaurant pinner",
    "valentines day menu",
    "romantic dinner near me",
    "valentines day 2026 restaurant",
    "italian valentines dinner",
    "valentines day booking pinner"
  ],
  openGraph: {
    title: "Valentine's Day 2026 | Dona Theresa Italian Restaurant",
    description: "Celebrate love with a romantic 3-course Italian dinner. £39.95 per person in a beautiful candlelit atmosphere.",
    type: "website",
    images: ["https://donatheresa.com/hero-main.png"]
  },
  alternates: {
    canonical: "https://donatheresa.com/menu/valentines-day"
  }
}

export default function ValentinesDayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
