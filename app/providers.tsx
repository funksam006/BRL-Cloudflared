// /app/providers.tsx
'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { walletConnect } from '@wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { ReactNode } from 'react'

const config = createConfig({
  chains: [mainnet],
  connectors: [
    walletConnect({
      projectId: 'b6635b23548368e7cacd2da5ff781b9c',
    })
  ],
  transports: {
    [mainnet.id]: http()
  }
})

// ✅ Do NOT pass `chains` here
createWeb3Modal({
  wagmiConfig: config,
  projectId: 'b6635b23548368e7cacd2da5ff781b9c',
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
