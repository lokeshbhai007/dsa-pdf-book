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
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        {/* Favicon */}
        <link rel="icon" href="/dsa-logo-note.png" type="image/png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
