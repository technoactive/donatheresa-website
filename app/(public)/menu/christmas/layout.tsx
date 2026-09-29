import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Christmas Menu 2026",
  description: "Christmas Carte at Dona Theresa, Hatch End. Two courses from £25.95 at lunch, £29.95 at dinner; three courses £29.95 / £33.95. Norfolk turkey, Italian classics, Christmas pudding. Book: 020 8421 5550.",
  keywords: [
    "christmas menu hatch end",
    "christmas menu pinner",
    "christmas dinner pinner",
    "christmas lunch hatch end",
    "christmas party restaurant harrow",
    "office christmas party pinner",
    "italian christmas menu london",
    "festive menu hatch end",
  ],
  openGraph: {
    title: "Christmas Carte 2026 | Dona Theresa, Hatch End",
    description: "Two courses from £25.95, three from £29.95. Norfolk roast turkey alongside our Italian classics, then Christmas pudding or panettone butter pudding.",
    type: "website",
    url: "https://donatheresa.co.uk/menu/christmas",
    images: ["https://donatheresa.co.uk/christmas-dinner.jpg"],
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/menu/christmas",
  },
}

export default function ChristmasMenuLayout({ children }: { children: React.ReactNode }) {
  return children
}
