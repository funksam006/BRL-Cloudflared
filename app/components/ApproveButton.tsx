'use client'

import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { BRL_ABI } from '../lib/abi'
import { BRL_TOKEN_ADDRESS, BRL_RECEIVER } from '../lib/constants'

export default function ApproveButton() {
  const { writeContract, isPending } = useWriteContract()

  const handleApprove = () => {
    writeContract({
      address: BRL_TOKEN_ADDRESS,
      abi: BRL_ABI,
      functionName: 'approve',
      args: [BRL_RECEIVER, parseEther('1000000000')],
    })
  }

  return (
    <button onClick={handleApprove} disabled={isPending}>
      {isPending ? 'Approving...' : 'Approve BRL'}
    </button>
  )
}
