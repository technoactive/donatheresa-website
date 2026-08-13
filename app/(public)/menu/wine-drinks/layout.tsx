import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wine List",
  description: "Wine list at Dona Theresa in Hatch End. Italian reds and whites, Prosecco, Champagne and cocktails to pair with dinner. 451 Uxbridge Road. Book: 020 8421 5550",
  openGraph: {
    title: "Wine List | Dona Theresa Hatch End",
    description: "Italian reds and whites, Prosecco, Champagne and cocktails at Dona Theresa in Hatch End.",
    type: "website",
    url: "https://donatheresa.co.uk/menu/wine-drinks",
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/menu/wine-drinks"
  }
}

export default function WineDrinksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
