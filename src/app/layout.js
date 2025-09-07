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
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-mono antialiased">
        {children}
      </body>
    </html>
  )
}