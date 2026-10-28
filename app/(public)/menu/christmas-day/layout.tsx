import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Christmas Day Menu 2026",
  description: "Christmas Day lunch at Dona Theresa, Hatch End: three courses £82.95 per person. Norfolk roast turkey with all the trimmings, lamb shank, sea bass, fillet steak al Barolo, Christmas pudding. Book: 020 8421 5550.",
  keywords: [
    "christmas day lunch hatch end",
    "christmas day restaurant pinner",
    "christmas day menu harrow",
    "restaurants open christmas day pinner",
    "christmas day dinner north west london",
    "italian christmas day menu",
  ],
  openGraph: {
    title: "Christmas Day Menu 2026 | Dona Theresa, Hatch End",
    description: "Three courses £82.95 per person on Christmas Day. Norfolk turkey with all the trimmings alongside our Italian classics.",
    type: "website",
    url: "https://donatheresa.co.uk/menu/christmas-day",
    images: ["https://donatheresa.co.uk/christmas-dinner.jpg"],
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/menu/christmas-day",
  },
}

export default function ChristmasDayMenuLayout({ children }: { children: React.ReactNode }) {
  return children
}
