'use client'

import './globals.css'
import '../public/css/main.e64e4c93.css'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/wagmi/config'
import '@/wagmi/web3modal'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo192.png" type="image/png" />
        <title>BULL RUN | HYPER DEFLATIONARY TOKEN</title>
        <meta name="description" content="Stake your BRL tokens safely" />
      </head>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
