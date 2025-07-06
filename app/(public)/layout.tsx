"use client"

import type React from "react"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import OfferPopup, { useOfferPopup } from "@/components/public/offer-popup"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, closePopup } = useOfferPopup()

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
      <OfferPopup isOpen={isOpen} onClose={closePopup} />
    </div>
  )
}
