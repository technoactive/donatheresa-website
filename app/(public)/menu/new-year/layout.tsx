import { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Year's Eve Menu 2026",
  description: "New Year's Eve at Dona Theresa, Hatch End: three courses £82.95 per person. Half duck in orange sauce, fillet steak with gorgonzola, king prawns in Cointreau, Sicilian arancini. Book: 020 8421 5550.",
  keywords: [
    "new years eve restaurant hatch end",
    "new years eve dinner pinner",
    "new years eve menu harrow",
    "nye restaurant north west london",
    "italian new years eve menu",
    "new year dinner pinner",
  ],
  openGraph: {
    title: "New Year's Eve Menu 2026 | Dona Theresa, Hatch End",
    description: "Three courses £82.95 per person on New Year's Eve. Half duck in orange, fillet steak with gorgonzola, seafood spaghetti and the classics.",
    type: "website",
    url: "https://donatheresa.co.uk/menu/new-year",
    images: ["https://donatheresa.co.uk/christmas-dinner.jpg"],
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/menu/new-year",
  },
}

export default function NewYearMenuLayout({ children }: { children: React.ReactNode }) {
  return children
}
