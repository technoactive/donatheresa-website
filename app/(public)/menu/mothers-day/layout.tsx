import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mother's Day Menu 2026",
  description: "💐 Mother's Day at Dona Theresa! £32.95pp + 10% service • 3-course Italian feast • Book now ☎️ 020 8421 5550 • Pinner & Hatch End",
  keywords: [
    "mothers day dinner pinner",
    "mothers day restaurant hatch end",
    "mothers day menu",
    "mothers day 2026 restaurant",
    "italian mothers day dinner",
    "mothers day booking pinner",
    "mothers day lunch near me",
    "family restaurant hatch end",
    "sunday lunch pinner",
    "mothers day special menu"
  ],
  openGraph: {
    title: "Mother's Day 2026 | Dona Theresa Italian Restaurant",
    description: "Celebrate Mum with a delicious 3-course Italian feast. £32.95 per person + 10% service. Book now!",
    type: "website",
    images: ["https://donatheresa.co.uk/hero-main.png"]
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/menu/mothers-day"
  }
}

export default function MothersDayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
