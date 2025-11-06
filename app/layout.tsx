import './globals.css'
import { Inter } from 'next/font/google'
import { WalletProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Klio.fun - Trade What You Believe',
  description: 'Decentralized prediction markets on Solana. Knowledge is power. Predictions are profit.',
  keywords: ['solana', 'prediction markets', 'defi', 'trading', 'blockchain', 'klio', 'knowledge'],
  authors: [{ name: 'Klio.fun Team' }],
  openGraph: {
    title: 'Klio.fun - Trade What You Believe',
    description: 'Decentralized prediction markets on Solana. Knowledge is power. Predictions are profit.',
    url: 'https://klio.fun',
    siteName: 'Klio.fun',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Klio.fun - Decentralized Prediction Markets',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Klio.fun - Trade What You Believe',
    description: 'Decentralized prediction markets on Solana. Knowledge is power. Predictions are profit.',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-fate-dark text-white min-h-screen`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}