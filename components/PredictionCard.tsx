'use client'

import { useState } from 'react'
import { Clock, Users, TrendingUp, ArrowUp, ArrowDown, Flame, Star, Zap, Bitcoin, Cpu, Dog, Trophy, Rocket } from 'lucide-react'

interface Prediction {
  id: string
  event: string
  deadline: Date
  yesPrice: number
  noPrice: number
  volume: number
  creator: string
  participants: number
  category?: string
  trending?: boolean
}

interface PredictionCardProps {
  prediction: Prediction
  onTrade?: (predictionId: string, side: 'yes' | 'no', amount: number) => Promise<boolean>
}

export function PredictionCard({ prediction, onTrade }: PredictionCardProps) {
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no'>('yes')
  const [tradeAmount, setTradeAmount] = useState(0.1) // Default to 0.1 SOL
  const [isTrading, setIsTrading] = useState(false)

  const handleTrade = (side: 'yes' | 'no') => {
    setSelectedSide(side)
    setShowTradeModal(true)
  }

  const confirmTrade = async () => {
    console.log('🎯 Confirming trade:', { predictionId: prediction.id, side: selectedSide, amount: tradeAmount })
    
    if (!onTrade) {
      console.error('❌ onTrade function not provided')
      alert('Trading function not available')
      return
    }
    
    if (!prediction.id) {
      console.error('❌ Prediction ID missing')
      alert('Prediction ID missing')
      return
    }
    
    try {
      setIsTrading(true)
      console.log('📡 Calling onTrade function...')
      const result = await onTrade(prediction.id, selectedSide, tradeAmount)
      console.log('✅ Trade completed:', result)
      
      if (result) {
        setShowTradeModal(false) // Only close modal on success
        setTradeAmount(0.1) // Reset amount after successful trade
      } else {
        console.error('❌ Trade returned false')
        alert('Trade failed - please try again')
      }
    } catch (error) {
      console.error('❌ Trade error:', error)
      alert(`Trade failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Keep modal open on error
    } finally {
      setIsTrading(false)
    }
  }
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`
    return `$${volume}`
  }

  const formatTimeLeft = (deadline: Date) => {
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 365) return `${Math.floor(days / 365)}Y`
    if (days > 30) return `${Math.floor(days / 30)}M`
    if (days > 0) return `${days}D`
    return 'SOON'
  }

  const yesPercentage = Math.round(prediction.yesPrice * 100)
  const noPercentage = Math.round(prediction.noPrice * 100)

  const getCategoryData = (category: string) => {
    const categoryData = {
      'Crypto': { color: '#ffff00', icon: Bitcoin },
      'Tech': { color: '#00ffff', icon: Cpu },
      'Memes': { color: '#ff0080', icon: Dog },
      'Stocks': { color: '#00ff00', icon: TrendingUp },
      'Space': { color: '#8000ff', icon: Rocket },
      'Sports': { color: '#ff4000', icon: Trophy },
    }
    return categoryData[category as keyof typeof categoryData] || { color: '#ffffff', icon: Star }
  }

  const cardStyle = {
    background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
    border: '3px solid #333333',
    color: '#ffffff',
    padding: 'clamp(20px, 4vw, 32px)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: 'clamp(400px, 50vh, 500px)',
  }

  const progressBarStyle = {
    width: '100%',
    height: '12px',
    background: '#333333',
    border: '2px solid #666666',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }

  const progressFillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #00ff00 0%, #00ffff 100%)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    width: `${yesPercentage}%`,
    position: 'relative' as const,
  }

  const yesButtonStyle = {
    background: '#00ff00',
    color: '#000000',
    border: '3px solid #000000',
    fontWeight: 800,
    padding: 'clamp(16px, 3vw, 20px) clamp(20px, 4vw, 24px)',
    fontSize: 'clamp(14px, 3vw, 16px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    minHeight: 'clamp(60px, 8vw, 80px)',
  }

  const noButtonStyle = {
    background: '#ff0080',
    color: '#ffffff',
    border: '3px solid #000000',
    fontWeight: 800,
    padding: 'clamp(16px, 3vw, 20px) clamp(20px, 4vw, 24px)',
    fontSize: 'clamp(14px, 3vw, 16px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    minHeight: 'clamp(60px, 8vw, 80px)',
  }

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#00ff00'
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 3px #00ff00'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#333333'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Trending badge */}
      {prediction.trending && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '-12px',
          background: '#ff4000',
          border: '3px solid #000000',
          padding: '8px',
          zIndex: 10,
        }}>
          <Flame size={20} color="#ffffff" />
        </div>
      )}

      {/* Category badge */}
      {prediction.category && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#000000',
          border: `2px solid ${getCategoryData(prediction.category).color}`,
          color: getCategoryData(prediction.category).color,
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '24px',
        }}>
          {(() => {
            const CategoryIcon = getCategoryData(prediction.category).icon
            return <CategoryIcon size={12} />
          })()}
          {prediction.category}
        </div>
      )}

      {/* Event title */}
      <div style={{ marginBottom: '32px', flex: 1 }}>
        <h3 style={{
          fontWeight: 800,
          fontSize: '22px',
          marginBottom: '16px',
          lineHeight: 1.2,
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {prediction.event}
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '14px',
          color: '#cccccc',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} />
            <span>{formatTimeLeft(prediction.deadline)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} />
            <span>{prediction.participants.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} />
            <span>{formatVolume(prediction.volume)}</span>
          </div>
        </div>
      </div>

      {/* Belief meter */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: 800, 
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            BELIEF METER
          </span>
          <span style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#00ff00',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '1px',
          }}>
            {yesPercentage}%
          </span>
        </div>
        
        <div style={progressBarStyle}>
          <div style={progressFillStyle}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
              animation: 'shimmer-sharp 1.5s infinite',
            }} />
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#999999',
          marginTop: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <span>YES {yesPercentage}%</span>
          <span>NO {noPercentage}%</span>
        </div>
      </div>

      {/* Trading buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '24px',
      }}>
        <button 
          style={yesButtonStyle}
          onClick={() => handleTrade('yes')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#000000'
            e.currentTarget.style.color = '#00ff00'
            e.currentTarget.style.borderColor = '#00ff00'
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 255, 0, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#00ff00'
            e.currentTarget.style.color = '#000000'
            e.currentTarget.style.borderColor = '#000000'
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUp size={20} />
            <span style={{ fontSize: '20px' }}>YES</span>
          </div>
          <div style={{ 
            fontSize: '16px', 
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
          }}>
            {(prediction.yesPrice).toFixed(3)} SOL
          </div>
        </button>
        
        <button 
          style={noButtonStyle}
          onClick={() => handleTrade('no')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#000000'
            e.currentTarget.style.color = '#ff0080'
            e.currentTarget.style.borderColor = '#ff0080'
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 0, 128, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ff0080'
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.borderColor = '#000000'
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowDown size={20} />
            <span style={{ fontSize: '20px' }}>NO</span>
          </div>
          <div style={{ 
            fontSize: '16px', 
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
          }}>
            {(prediction.noPrice).toFixed(3)} SOL
          </div>
        </button>
      </div>

      {/* Creator info */}
      <div style={{
        paddingTop: '24px',
        borderTop: '2px solid #333333',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ 
            fontSize: '14px', 
            color: '#cccccc',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 600,
          }}>
            BY <span style={{ color: '#00ff00', fontWeight: 800 }}>{prediction.creator}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#00ff00',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            <Zap size={12} />
            LIVE
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
            border: '3px solid #333333',
            maxWidth: '500px',
            width: '100%',
            padding: '40px',
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 900,
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: selectedSide === 'yes' ? '#00ff00' : '#ff0080',
            }}>
              TRADE {selectedSide.toUpperCase()}
            </h3>
            
            <p style={{
              color: '#cccccc',
              marginBottom: '30px',
              fontSize: '16px',
              lineHeight: 1.4,
            }}>
              {prediction.event}
            </p>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 700,
                marginBottom: '12px',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                AMOUNT (SOL)
              </label>
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(Number(e.target.value))}
                min="0.01"
                max="1000"
                step="0.01"
                style={{
                  background: '#000000',
                  border: '2px solid #ffffff',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 600,
                  width: '100%',
                  padding: '16px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
            </div>

            <div style={{
              background: '#000000',
              border: '2px solid #333333',
              padding: '20px',
              marginBottom: '30px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '14px',
                color: '#cccccc',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                <span>CURRENT PRICE:</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>
                  {selectedSide === 'yes' ? prediction.yesPrice.toFixed(3) : prediction.noPrice.toFixed(3)} SOL
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '14px',
                color: '#cccccc',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                <span>POTENTIAL RETURN:</span>
                <span style={{ color: '#00ff00', fontWeight: 700 }}>
                  {(tradeAmount / (selectedSide === 'yes' ? prediction.yesPrice : prediction.noPrice)).toFixed(2)} SOL
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => setShowTradeModal(false)}
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  fontWeight: 700,
                  padding: '16px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  flex: 1,
                }}
              >
                CANCEL
              </button>
              <button
                onClick={confirmTrade}
                disabled={!onTrade || isTrading}
                style={{
                  background: selectedSide === 'yes' ? '#00ff00' : '#ff0080',
                  color: selectedSide === 'yes' ? '#000000' : '#ffffff',
                  border: '2px solid #000000',
                  fontWeight: 700,
                  padding: '16px 24px',
                  fontSize: '16px',
                  cursor: (onTrade && !isTrading) ? 'pointer' : 'not-allowed',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  flex: 1,
                  opacity: (onTrade && !isTrading) ? 1 : 0.5,
                }}
              >
                {isTrading ? 'TRADING...' : (onTrade ? 'CONFIRM TRADE' : 'LOADING...')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}