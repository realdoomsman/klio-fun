'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { getUserPositions, getAllPredictions, claimWinnings } from '@/lib/anchor-client'
import { useConnection } from '@solana/wallet-adapter-react'
import { toast } from 'react-hot-toast'
import { Wallet, TrendingUp, Trophy, DollarSign, Clock, Zap } from 'lucide-react'

interface Position {
  prediction: string
  user: string
  yesTokens: number
  noTokens: number
  totalInvested: number
  predictionData?: any
  potentialPayout?: number
  status: 'active' | 'won' | 'lost' | 'resolved'
}

export function Portfolio() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(false)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    if (publicKey) {
      fetchPositions()
    }
  }, [publicKey])

  const fetchPositions = async () => {
    if (!publicKey) return

    try {
      setLoading(true)
      const userPositions = getUserPositions(publicKey.toString())
      const allPredictions = getAllPredictions()

      const enrichedPositions = userPositions.map((pos: any) => {
        const predictionData = allPredictions.find((p: any) => p.address === pos.prediction)
        
        let status: 'active' | 'won' | 'lost' | 'resolved' = 'active'
        let potentialPayout = 0

        if (predictionData?.resolved) {
          const winningTokens = predictionData.outcome ? pos.yesTokens : pos.noTokens
          const totalWinningTokens = predictionData.outcome ? predictionData.yesSupply : predictionData.noSupply
          
          if (winningTokens > 0 && totalWinningTokens > 0) {
            potentialPayout = (winningTokens / totalWinningTokens) * (predictionData.totalVolume * 0.98)
            status = 'won'
          } else {
            status = 'lost'
          }
        }

        return {
          ...pos,
          predictionData,
          potentialPayout,
          status,
        }
      })

      setPositions(enrichedPositions)
    } catch (error) {
      console.error('Error fetching positions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimWinnings = async (position: Position) => {
    if (!publicKey || !sendTransaction) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      toast.loading('Claiming winnings...', { id: 'claim-loading' })

      const result = await claimWinnings(
        connection,
        { publicKey, sendTransaction },
        position.prediction
      )

      toast.success(
        `Successfully claimed ${result.payout.toFixed(3)} SOL!`,
        { id: 'claim-loading' }
      )

      fetchPositions() // Refresh positions
    } catch (error: any) {
      toast.error(error.message || 'Failed to claim winnings', { id: 'claim-loading' })
    }
  }

  const totalInvested = positions.reduce((sum, pos) => sum + pos.totalInvested, 0)
  const totalPotentialWinnings = positions.reduce((sum, pos) => sum + (pos.potentialPayout || 0), 0)
  const activePositions = positions.filter(pos => pos.status === 'active').length
  const wonPositions = positions.filter(pos => pos.status === 'won').length

  if (!publicKey) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
        border: '3px solid #333333',
        padding: '60px',
        textAlign: 'center',
        margin: '40px 0',
      }}>
        <Wallet size={48} color="#666666" style={{ marginBottom: '20px' }} />
        <h2 style={{
          fontSize: '24px',
          fontWeight: 800,
          color: '#666666',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          margin: 0,
        }}>
          CONNECT WALLET TO VIEW PORTFOLIO
        </h2>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 900,
          marginBottom: '40px',
          textTransform: 'uppercase',
          letterSpacing: '-1px',
          background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
        }}>
          YOUR PORTFOLIO
        </h1>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
            border: '3px solid #00ff00',
            padding: '24px',
            textAlign: 'center',
          }}>
            <DollarSign size={32} color="#00ff00" style={{ marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#00ff00',
              margin: '0 0 8px 0',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {totalInvested.toFixed(2)} SOL
            </h3>
            <p style={{
              color: '#cccccc',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}>
              TOTAL INVESTED
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
            border: '3px solid #00ffff',
            padding: '24px',
            textAlign: 'center',
          }}>
            <TrendingUp size={32} color="#00ffff" style={{ marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#00ffff',
              margin: '0 0 8px 0',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {totalPotentialWinnings.toFixed(2)} SOL
            </h3>
            <p style={{
              color: '#cccccc',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}>
              POTENTIAL WINNINGS
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
            border: '3px solid #ff0080',
            padding: '24px',
            textAlign: 'center',
          }}>
            <Clock size={32} color="#ff0080" style={{ marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ff0080',
              margin: '0 0 8px 0',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {activePositions}
            </h3>
            <p style={{
              color: '#cccccc',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}>
              ACTIVE POSITIONS
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
            border: '3px solid #ffff00',
            padding: '24px',
            textAlign: 'center',
          }}>
            <Trophy size={32} color="#ffff00" style={{ marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffff00',
              margin: '0 0 8px 0',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {wonPositions}
            </h3>
            <p style={{
              color: '#cccccc',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}>
              WINNING POSITIONS
            </p>
          </div>
        </div>

        {/* Positions List */}
        <div style={{
          background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
          border: '3px solid #333333',
          padding: '32px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 800,
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#ffffff',
          }}>
            YOUR POSITIONS
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
              Loading positions...
            </div>
          ) : positions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
              No positions found. Start trading to see your portfolio!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {positions.map((position, index) => (
                <div
                  key={index}
                  style={{
                    background: '#000000',
                    border: `2px solid ${
                      position.status === 'won' ? '#00ff00' :
                      position.status === 'lost' ? '#ff0080' :
                      '#333333'
                    }`,
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      marginBottom: '8px',
                      color: '#ffffff',
                    }}>
                      {position.predictionData?.eventDescription || 'Unknown Market'}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      fontSize: '14px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#cccccc',
                    }}>
                      <span>YES: {position.yesTokens.toFixed(2)}</span>
                      <span>NO: {position.noTokens.toFixed(2)}</span>
                      <span>Invested: {position.totalInvested.toFixed(2)} SOL</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: position.status === 'won' ? '#00ff00' : 
                               position.status === 'lost' ? '#ff0080' : '#ffff00',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        {position.status === 'won' ? `+${position.potentialPayout?.toFixed(2)} SOL` :
                         position.status === 'lost' ? '-' + position.totalInvested.toFixed(2) + ' SOL' :
                         'ACTIVE'}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666666',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        {position.status}
                      </div>
                    </div>

                    {position.status === 'won' && (
                      <button
                        onClick={() => handleClaimWinnings(position)}
                        style={{
                          background: '#00ff00',
                          color: '#000000',
                          border: '2px solid #000000',
                          padding: '8px 16px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Zap size={14} />
                        CLAIM
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}