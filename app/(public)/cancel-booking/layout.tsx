import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cancel Booking",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CancelBookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
