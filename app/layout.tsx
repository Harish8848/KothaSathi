"use client"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans min-h-screen flex flex-col`}>
        <SessionProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
