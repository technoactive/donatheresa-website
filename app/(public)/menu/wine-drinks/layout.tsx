import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wine & Drinks Menu",
  description: "Italian, French and New World wines, Prosecco, Champagne, cocktails and soft drinks at Dona Theresa in Hatch End. Book: 020 8421 5550",
  keywords: [
    "wine menu Hatch End",
    "Italian wine list",
    "Prosecco",
    "Champagne",
    "cocktails Hatch End",
    "drinks menu",
    "Italian restaurant wine",
    "Chianti",
    "Barolo",
    "Amarone",
    "Prosecco cocktails"
  ],
  openGraph: {
    title: "Wine & Drinks Menu | Dona Theresa",
    description: "Extensive wine list with Italian classics, French champagnes, premium cocktails and more",
    type: "website",
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
