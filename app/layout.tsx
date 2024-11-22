import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JingleBox',
  description: 'Create your personalized Christmas page',
  icons: {
    icon: [
      { url: 'https://media.discordapp.net/attachments/1193183717548638301/1307233740799475732/image-removebg-preview_35.png?ex=67398fcb&is=67383e4b&hm=cb51b9f11fe59621faf6e13fdba6d98c5acbb4be116e7aa4f875d72fa751ee5a&=&format=webp&quality=lossless', sizes: 'any' },
      { url: 'https://media.discordapp.net/attachments/1193183717548638301/1307233740799475732/image-removebg-preview_35.png?ex=67398fcb&is=67383e4b&hm=cb51b9f11fe59621faf6e13fdba6d98c5acbb4be116e7aa4f875d72fa751ee5a&=&format=webp&quality=lossless', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="140337247a97003ca863d93da8f19220" />
      </head>
      <Script
        src="https://alwingulla.com/88/tag.min.js"
        data-zone="115418"
        async
        data-cfasync="false"
        strategy="afterInteractive"
      />
      <body className={inter.className}>{children}</body>
    </html>
  )
}

