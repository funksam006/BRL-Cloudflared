// wagmi/config.ts
import { createConfig, http } from 'wagmi'
import { walletConnect } from '@wagmi/connectors'
import { mainnet } from 'wagmi/chains'

export const config = createConfig({
  connectors: [
    walletConnect({
      projectId: 'b6635b23548368e7cacd2da5ff781b9c',
      metadata: {
        name: 'BRL Dapp',
        description: 'BRL Staking',
        url: 'https://pumptokens.fun/',
        icons: ['https://pumptokens.fun/favicon.ico']
      }
    })
  ],
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
})
