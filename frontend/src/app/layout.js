import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TalentHub - Connect Talent with Opportunity',
  description: 'Professional job portal with verified profiles, interview scheduling, and credit-based contact access',
  keywords: 'jobs, recruitment, talent, hiring, job portal, career',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
