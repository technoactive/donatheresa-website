import { Metadata } from "next"

export const metadata: Metadata = {
  title: "À La Carte Menu | Fine Italian Dining | Dona Theresa",
  description: "Explore our signature À La Carte menu featuring authentic Italian dishes. Fresh pasta, premium meats, seafood and more at Dona Theresa Restaurant.",
  keywords: "italian menu, a la carte, fine dining pinner, italian food hatch end, pasta menu, steak menu",
  openGraph: {
    title: "À La Carte Menu | Dona Theresa Italian Restaurant",
    description: "Explore our signature À La Carte menu featuring authentic Italian dishes. Fresh pasta, premium meats, seafood and more.",
    type: "website",
    images: ["https://donatheresa.com/dish-filleto-rossini.png"]
  },
  alternates: {
    canonical: "https://donatheresa.com/menu/a-la-carte"
  }
}

export default function AlaCarteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
