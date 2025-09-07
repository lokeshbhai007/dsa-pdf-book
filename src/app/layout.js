// src/app/layout.js
import './globals.css'
import { JetBrains_Mono } from 'next/font/google'

// Configure the font
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata = {
  title: 'DSA Notes - Professional Note Taking',
  description: 'Create and export professional PDF notes with dark/light themes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/dsa-logo-note.png" type="image/png" />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}