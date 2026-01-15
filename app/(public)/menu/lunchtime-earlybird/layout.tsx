import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lunchtime & Early Bird Menu | £19.95 - 2 Courses | Dona Theresa",
  description: "Exceptional value 2-course menu for just £19.95. Available Tuesday-Sunday for lunch and early dinner at Dona Theresa Italian Restaurant in Hatch End.",
  keywords: "lunch menu pinner, early bird menu hatch end, cheap lunch harrow, set menu italian, value dining",
  openGraph: {
    title: "Lunchtime & Early Bird Menu | Dona Theresa",
    description: "Exceptional value 2-course menu for just £19.95. Available Tuesday-Sunday for lunch and early dinner.",
    type: "website",
    images: ["https://donatheresa.com/pasta-carbonara.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.com/menu/lunchtime-earlybird"
  }
}

export default function LunchtimeEarlybirdLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
