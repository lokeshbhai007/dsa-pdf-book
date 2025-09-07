// src/app/layout.js
import './globals.css'

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}