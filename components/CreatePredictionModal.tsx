'use client'

import { useState } from 'react'
import { X, Calendar, Globe, Percent, Zap, Rocket, Info, Activity, Bitcoin, Cpu, Dog, TrendingUp, Rocket as RocketIcon, Trophy } from 'lucide-react'

interface CreatePredictionModalProps {
  onClose: () => void
  onSubmit?: (data: any) => void
}

export function CreatePredictionModal({ onClose, onSubmit }: CreatePredictionModalProps) {
  const [formData, setFormData] = useState({
    event: '',
    deadline: '',
    oracleSource: 'Manual Resolution',
    startingOdds: '50',
    category: 'Crypto',
  })

  const [step, setStep] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const predictionData = {
      ...formData,
      id: Date.now().toString(),
      yesPrice: parseInt(formData.startingOdds) / 100,
      noPrice: 1 - (parseInt(formData.startingOdds) / 100),
      volume: 0,
      participants: 0,
      trending: false,
    }
    
    onSubmit?.(predictionData)
    setStep(3)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const categories = [
    { name: 'Crypto', icon: Bitcoin, color: '#ffff00' },
    { name: 'Tech', icon: Cpu, color: '#00ffff' },
    { name: 'Memes', icon: Dog, color: '#ff0080' },
    { name: 'Stocks', icon: TrendingUp, color: '#00ff00' },
    { name: 'Space', icon: RocketIcon, color: '#8000ff' },
    { name: 'Sports', icon: Trophy, color: '#ff4000' },
  ]

  const modalStyle = {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 50,
    padding: 'clamp(8px, 2vw, 20px)',
    overflowY: 'auto' as const,
  }

  const cardStyle = {
    background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
    border: '3px solid #333333',
    maxWidth: '600px',
    width: '100%',
    padding: 'clamp(20px, 5vw, 40px)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    marginTop: 'clamp(20px, 5vh, 40px)',
    marginBottom: 'clamp(20px, 5vh, 40px)',
    minHeight: 'auto',
  }

  const inputStyle = {
    background: '#000000',
    border: '2px solid #ffffff',
    color: '#ffffff',
    fontSize: 'clamp(14px, 3vw, 16px)',
    fontWeight: 500,
    width: '100%',
    padding: 'clamp(12px, 3vw, 16px)',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    minHeight: '48px',
    boxSizing: 'border-box' as const,
  }

  const buttonStyle = {
    background: '#ffffff',
    color: '#000000',
    border: '3px solid #000000',
    fontWeight: 800,
    padding: 'clamp(16px, 4vw, 20px) clamp(24px, 6vw, 40px)',
    fontSize: 'clamp(14px, 3vw, 16px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: 'clamp(1px, 0.3vw, 2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(8px, 2vw, 12px)',
    width: '100%',
    minHeight: '56px',
  }

  const secondaryButtonStyle = {
    background: '#000000',
    color: '#ffffff',
    border: '3px solid #ffffff',
    fontWeight: 800,
    padding: 'clamp(16px, 4vw, 20px) clamp(24px, 6vw, 40px)',
    fontSize: 'clamp(14px, 3vw, 16px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: 'clamp(1px, 0.3vw, 2px)',
    width: '100%',
    minHeight: '56px',
  }

  return (
    <div style={modalStyle}>
      <div style={cardStyle}>
        {step === 1 && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'clamp(24px, 6vw, 40px)',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'clamp(12px, 3vw, 16px)',
                flex: 1,
                minWidth: '200px',
              }}>
                <div style={{
                  background: '#000000',
                  border: '3px solid #00ff00',
                  padding: 'clamp(8px, 2vw, 12px)',
                  flexShrink: 0,
                }}>
                  <Zap color="#00ff00" size={24} />
                </div>
                <h2 style={{
                  fontSize: 'clamp(20px, 6vw, 36px)',
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: 'clamp(1px, 0.3vw, 2px)',
                  lineHeight: 1.1,
                }}>
                  CREATE FATE
                </h2>
              </div>
              <button 
                onClick={onClose}
                style={{
                  color: '#ffffff',
                  background: '#000000',
                  border: '2px solid #ffffff',
                  cursor: 'pointer',
                  padding: '12px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#000000'
                  e.currentTarget.style.background = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.background = '#000000'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '18px',
                  fontWeight: 800,
                  marginBottom: '16px',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  WHAT'S YOUR PREDICTION?
                </label>
                <textarea
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  placeholder="WILL SOLANA HIT $500 BY JUNE 2026?"
                  style={{
                    ...inputStyle,
                    height: '120px',
                    resize: 'none' as const,
                    fontSize: '18px',
                  }}
                  maxLength={280}
                  required
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00ff00'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 255, 0, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#ffffff'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: '#cccccc',
                  marginTop: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  <span>MAKE IT CLEAR AND SPECIFIC</span>
                  <span>{formData.event.length}/280</span>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '18px',
                  fontWeight: 800,
                  marginBottom: '16px',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  CHOOSE CATEGORY
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                }}>
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: category.name })}
                      style={{
                        padding: '20px',
                        border: formData.category === category.name 
                          ? `3px solid ${category.color}` 
                          : '3px solid #666666',
                        background: formData.category === category.name 
                          ? '#000000' 
                          : '#111111',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: '#ffffff',
                      }}
                      onMouseEnter={(e) => {
                        if (formData.category !== category.name) {
                          e.currentTarget.style.borderColor = category.color
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.category !== category.name) {
                          e.currentTarget.style.borderColor = '#666666'
                        }
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <category.icon size={32} color={formData.category === category.name ? category.color : '#ffffff'} />
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: formData.category === category.name ? category.color : '#ffffff',
                      }}>
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  fontSize: '18px',
                  fontWeight: 800,
                  marginBottom: '16px',
                  color: '#ffffff',
                  alignItems: 'center',
                  gap: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  <Calendar size={24} />
                  RESOLUTION DATE
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  style={{
                    ...inputStyle,
                    fontSize: '18px',
                  }}
                  required
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00ff00'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 255, 0, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#ffffff'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!formData.event || !formData.deadline}
                style={{
                  ...buttonStyle,
                  fontSize: '18px',
                  padding: '20px 40px',
                  opacity: (!formData.event || !formData.deadline) ? 0.5 : 1,
                  cursor: (!formData.event || !formData.deadline) ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#00ff00'
                    e.currentTarget.style.borderColor = '#00ff00'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 255, 0, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#ffffff'
                    e.currentTarget.style.borderColor = '#000000'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                CONTINUE
                <Rocket size={24} />
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
            }}>
              <button 
                onClick={() => setStep(1)}
                style={{
                  color: '#ffffff',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#00ff00'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
              >
                ← BACK
              </button>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 900,
                background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                FINAL DETAILS
              </h2>
              <button 
                onClick={onClose}
                style={{
                  color: '#ffffff',
                  background: '#000000',
                  border: '2px solid #ffffff',
                  cursor: 'pointer',
                  padding: '12px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#000000'
                  e.currentTarget.style.background = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.background = '#000000'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '18px',
                  fontWeight: 800,
                  marginBottom: '16px',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  <Globe size={24} />
                  RESOLUTION METHOD
                </label>
                <select
                  value={formData.oracleSource}
                  onChange={(e) => setFormData({ ...formData, oracleSource: e.target.value })}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    fontSize: '18px',
                  }}
                >
                  <option value="Manual Resolution">MANUAL RESOLUTION</option>
                  <option value="CoinGecko">COINGECKO (PRICE DATA)</option>
                  <option value="Pyth Network">PYTH NETWORK</option>
                  <option value="Switchboard">SWITCHBOARD</option>
                  <option value="Custom API">CUSTOM API</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '18px',
                  fontWeight: 800,
                  marginBottom: '16px',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  <Percent size={24} />
                  STARTING PROBABILITY
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <input
                    type="range"
                    min="1"
                    max="99"
                    value={formData.startingOdds}
                    onChange={(e) => setFormData({ ...formData, startingOdds: e.target.value })}
                    style={{
                      flex: 1,
                      height: '12px',
                      background: 'linear-gradient(90deg, #00ff00 0%, #00ffff 50%, #ff0080 100%)',
                      border: '2px solid #000000',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                    className="slider-sharp"
                  />
                  <div style={{
                    background: '#000000',
                    border: '3px solid #00ff00',
                    padding: '12px 20px',
                    fontWeight: 900,
                    fontSize: '24px',
                    minWidth: '100px',
                    textAlign: 'center',
                    color: '#00ff00',
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '2px',
                  }}>
                    {formData.startingOdds}%
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#cccccc',
                  marginTop: '12px',
                  margin: '12px 0 0 0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 600,
                }}>
                  INITIAL BELIEF THAT EVENT WILL HAPPEN
                </p>
              </div>

              <div style={{
                background: '#000000',
                border: '3px solid #00ff00',
                padding: '32px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                }}>
                  <Info style={{ color: '#00ff00' }} size={24} />
                  <span style={{ 
                    fontWeight: 800, 
                    color: '#00ff00',
                    fontSize: '18px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    CREATOR BENEFITS
                  </span>
                </div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '16px',
                  color: '#ffffff',
                }}>
                  <li style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      background: '#00ff00',
                      border: '2px solid #000000',
                    }} />
                    2% OF ALL TRADING VOLUME
                  </li>
                  <li style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      background: '#00ffff',
                      border: '2px solid #000000',
                    }} />
                    EXCLUSIVE ORACLE NFT BADGE
                  </li>
                  <li style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      background: '#ff0080',
                      border: '2px solid #000000',
                    }} />
                    PROPHET REPUTATION POINTS
                  </li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    ...secondaryButtonStyle,
                    flex: 1,
                    padding: '20px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffffff'
                    e.currentTarget.style.color = '#000000'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#000000'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                >
                  BACK
                </button>
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    flex: 1,
                    padding: '20px',
                    fontSize: '18px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#00ff00'
                    e.currentTarget.style.borderColor = '#00ff00'
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 255, 0, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff'
                    e.currentTarget.style.borderColor = '#000000'
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Rocket size={24} />
                  LAUNCH FATE
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              background: '#000000',
              border: '4px solid #00ff00',
              width: '100px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px auto',
            }} className="pulse-neon">
              <Activity color="#00ff00" size={48} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
              <Zap size={32} color="#00ff00" />
              <h2 style={{
                fontSize: '48px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
              }}>
                FATE CREATED!
              </h2>
              <Zap size={32} color="#00ff00" />
            </div>
            <p style={{
              color: '#ffffff',
              fontSize: '20px',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600,
            }}>
              YOUR PREDICTION MARKET IS NOW LIVE
            </p>
          </div>
        )}
      </div>
    </div>
  )
}