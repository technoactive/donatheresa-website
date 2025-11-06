"use client"

import type React from "react"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { LocaleProvider } from "@/lib/locale-provider"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LocaleProvider>
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1">
          {children}
        </main>
        <PublicFooter />
      </div>
    </LocaleProvider>
  )
}
