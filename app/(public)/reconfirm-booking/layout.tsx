import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Confirm Booking",
  robots: {
    index: false,
    follow: false,
  },
}

export default function ReconfirmBookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
