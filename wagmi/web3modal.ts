// wagmi/web3modal.ts
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { config } from './config'

createWeb3Modal({
  wagmiConfig: config,
  projectId: 'b6635b23548368e7cacd2da5ff781b9c',
  enableAnalytics: false, // optional
})

