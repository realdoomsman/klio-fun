'use client'

import { useState, useEffect } from 'react'
import { Coins, Copy, ExternalLink, TrendingUp, Users, Zap, Twitter, Globe, MessageCircle, Star, Rocket, Target, Activity } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function Token() {
  const [mounted, setMounted] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // $KLIO Token Contract Address
  const contractAddress = "85kBatQcCu7ZFy5YZYBVWa1HKGaWVwiA9jaP9qz4pump"
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(true)
      toast.success('Contract address copied!')
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      toast.error('Failed to copy address')
    }
  }

  const tokenStats = [
    { label: 'Total Supply', value: '1,000,000,000', suffix: '$KLIO' },
    { label: 'Circulating Supply', value: '750,000,000', suffix: '$KLIO' },
    { label: 'Market Cap', value: 'TBD', suffix: '' },
    { label: 'Holders', value: 'TBD', suffix: '' },
  ]

  const tokenomics = [
    { category: 'Community & Rewards', percentage: 40, color: '#00ff00', description: 'Trading rewards, airdrops, community incentives' },
    { category: 'Liquidity Pool', percentage: 25, color: '#00ffff', description: 'DEX liquidity and market making' },
    { category: 'Development', percentage: 20, color: '#ff0080', description: 'Platform development and improvements' },
    { category: 'Marketing', percentage: 10, color: '#ffff00', description: 'Growth, partnerships, and promotion' },
    { category: 'Team', percentage: 5, color: '#ff4000', description: 'Core team allocation (vested)' },
  ]

  const roadmap = [
    { phase: 'Phase 1', title: 'Token Launch', status: 'upcoming', items: ['Deploy $KLIO token', 'Initial liquidity', 'Community building'] },
    { phase: 'Phase 2', title: 'Integration', status: 'planned', items: ['Token rewards for trading', 'Governance features', 'Staking mechanism'] },
    { phase: 'Phase 3', title: 'Expansion', status: 'planned', items: ['Cross-chain bridge', 'Mobile app', 'Advanced features'] },
  ]

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
        padding: '100px 20px',
        borderBottom: '3px solid #333333',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 49%, rgba(0, 255, 0, 0.03) 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(0, 255, 255, 0.03) 50%, transparent 51%)
          `,
          backgroundSize: '40px 40px',
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            background: '#000000',
            border: '3px solid #ffff00',
            padding: '16px 32px',
            marginBottom: '40px',
          }}>
            <Coins size={32} color="#ffff00" />
            <span style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#ffff00',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              $KLIO TOKEN
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '-3px',
            marginBottom: '2rem',
            background: 'linear-gradient(45deg, #ffffff 0%, #ffff00 30%, #00ff00 60%, #00ffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            POWER YOUR
            <br />
            <span style={{
              background: 'linear-gradient(45deg, #ffff00 0%, #00ff00 50%, #00ffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              PREDICTIONS
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 4vw, 24px)',
            fontWeight: 500,
            color: '#cccccc',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            lineHeight: 1.4,
          }}>
            THE NATIVE TOKEN OF KLIO.FUN PREDICTION MARKETS.<br />
            EARN REWARDS, GOVERN THE PLATFORM, SHAPE THE FUTURE.
          </p>
        </div>
      </section>

      {/* Contract Address Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #111111 0%, #000000 100%)',
        borderBottom: '3px solid #333333',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: 900,
            marginBottom: '40px',
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            background: 'linear-gradient(45deg, #ffffff 0%, #ffff00 50%, #00ff00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            CONTRACT ADDRESS
          </h2>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '3px solid #000000',
            padding: '40px',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(14px, 3vw, 18px)',
                fontWeight: 600,
                color: '#000000',
                wordBreak: 'break-all',
                flex: 1,
                textAlign: 'left',
              }}>
                {contractAddress}
              </div>
              
              <button
                onClick={() => copyToClipboard(contractAddress)}
                style={{
                  background: copiedAddress ? '#00ff00' : '#000000',
                  color: copiedAddress ? '#000000' : '#ffffff',
                  border: '2px solid #000000',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  if (!copiedAddress) {
                    e.currentTarget.style.background = '#00ff00'
                    e.currentTarget.style.color = '#000000'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copiedAddress) {
                    e.currentTarget.style.background = '#000000'
                    e.currentTarget.style.color = '#ffffff'
                  }
                }}
              >
                <Copy size={16} />
                {copiedAddress ? 'COPIED!' : 'COPY'}
              </button>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#000000',
              border: '2px solid #00ff00',
              color: '#00ff00',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              ⚡ $KLIO TOKEN IS LIVE ON SOLANA
            </div>
          </div>
        </div>
      </section>

      {/* Token Stats */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: 900,
            marginBottom: '60px',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            TOKEN STATS
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
            gap: 'clamp(20px, 4vw, 40px)',
          }}>
            {tokenStats.map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
                  border: '3px solid #333333',
                  padding: '40px 30px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00ff00'
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 255, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333333'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <h3 style={{
                  fontSize: 'clamp(24px, 5vw, 36px)',
                  fontWeight: 900,
                  marginBottom: '12px',
                  color: '#00ff00',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {stat.value}
                </h3>
                <p style={{
                  color: '#cccccc',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: 0,
                }}>
                  {stat.label}
                </p>
                {stat.suffix && (
                  <p style={{
                    color: '#ffff00',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginTop: '8px',
                    margin: 0,
                  }}>
                    {stat.suffix}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #111111 0%, #000000 100%)',
        borderBottom: '3px solid #333333',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: 900,
            marginBottom: '60px',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            TOKENOMICS
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 'clamp(20px, 4vw, 30px)',
          }}>
            {tokenomics.map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '3px solid #000000',
                  padding: '30px',
                  color: '#000000',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = item.color
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = `0 20px 40px ${item.color}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#000000'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    margin: 0,
                  }}>
                    {item.category}
                  </h3>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: item.color,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    {item.percentage}%
                  </span>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e0e0e0',
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    background: item.color,
                    transition: 'width 1s ease',
                  }} />
                </div>
                
                <p style={{
                  fontSize: '14px',
                  color: '#666666',
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: 900,
            marginBottom: '40px',
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            JOIN THE COMMUNITY
          </h2>

          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <a
              href="https://x.com/klioFun"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1DA1F2',
                color: '#ffffff',
                border: '3px solid #000000',
                padding: '20px 32px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(29, 161, 242, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Twitter size={24} />
              FOLLOW ON X
            </a>
          </div>

          <p style={{
            fontSize: '18px',
            color: '#cccccc',
            marginTop: '40px',
            fontWeight: 500,
          }}>
            Stay updated on $KLIO token launch, airdrops, and platform updates!
          </p>
        </div>
      </section>
    </div>
  )
}