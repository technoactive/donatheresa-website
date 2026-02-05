import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wine & Drinks Menu | Dona Theresa Italian Restaurant Hatch End",
  description: "Explore our extensive wine list featuring Italian, French, Spanish and New World wines. Premium cocktails, Prosecco, Champagne, spirits and soft drinks at Dona Theresa.",
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
}

export default function WineDrinksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
