import type React from "react"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white" style={{ backgroundColor: '#000000' }}>
      <PublicHeader />
      <main className="flex-1 bg-black" style={{ backgroundColor: '#000000' }}>{children}</main>
      <PublicFooter />
    </div>
  )
}
