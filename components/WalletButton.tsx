'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'

export function WalletButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{
        background: '#ffffff',
        color: '#000000',
        border: '3px solid #000000',
        fontWeight: 700,
        padding: '12px 24px',
        fontSize: '14px',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        borderRadius: '0px',
        cursor: 'pointer',
      }}>
        CONNECT WALLET
      </div>
    )
  }

  return <WalletMultiButton />
}