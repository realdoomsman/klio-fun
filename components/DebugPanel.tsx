'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface DebugPanelProps {
  predictions: any[]
  onTestTrade: (predictionId: string, side: 'yes' | 'no', amount: number) => void
}

export function DebugPanel({ predictions, onTestTrade }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { connected, publicKey } = useWallet()

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  const testTrade = () => {
    if (predictions.length > 0) {
      const testPrediction = predictions[0]
      console.log('🧪 Debug: Testing trade with prediction:', testPrediction)
      console.log('🔍 Prediction ID:', testPrediction.id)
      console.log('🔍 Prediction Address:', testPrediction.address)
      onTestTrade(testPrediction.id, 'yes', 0.1)
    } else {
      console.log('❌ No predictions available for testing')
    }
  }

  const clearStorage = () => {
    localStorage.removeItem('predictions')
    localStorage.removeItem('userPositions')
    window.location.reload()
  }

  const logStorage = () => {
    console.log('LocalStorage predictions:', localStorage.getItem('predictions'))
    console.log('LocalStorage positions:', localStorage.getItem('userPositions'))
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#ff0080',
          color: '#ffffff',
          border: '2px solid #000000',
          padding: '10px',
          fontSize: '12px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        DEBUG
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '50px',
          right: '0',
          background: '#111111',
          border: '2px solid #00ff00',
          padding: '20px',
          minWidth: '300px',
          color: '#ffffff',
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#00ff00' }}>DEBUG PANEL</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Wallet:</strong> {connected ? 'Connected' : 'Not Connected'}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Address:</strong> {publicKey?.toString().slice(0, 8)}...
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Predictions:</strong> {predictions.length}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={testTrade}
              style={{
                background: '#00ff00',
                color: '#000000',
                border: '1px solid #000000',
                padding: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Test Trade
            </button>
            
            <button
              onClick={() => {
                console.log('🔍 Wallet Debug Info:')
                console.log('- Connected:', connected)
                console.log('- PublicKey:', publicKey?.toString())
                console.log('- Predictions:', predictions.length)
                alert(`Wallet: ${connected ? 'Connected' : 'Not Connected'}\nPredictions: ${predictions.length}`)
              }}
              style={{
                background: '#ffff00',
                color: '#000000',
                border: '1px solid #000000',
                padding: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Check Wallet
            </button>
            
            <button
              onClick={logStorage}
              style={{
                background: '#00ffff',
                color: '#000000',
                border: '1px solid #000000',
                padding: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Log Storage
            </button>
            
            <button
              onClick={clearStorage}
              style={{
                background: '#ff4000',
                color: '#ffffff',
                border: '1px solid #000000',
                padding: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Clear Storage
            </button>
          </div>
        </div>
      )}
    </div>
  )
}