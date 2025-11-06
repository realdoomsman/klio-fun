'use client'

import { useState, useEffect } from 'react'
import { Clock, ExternalLink, CheckCircle, AlertCircle, Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface TradeRecord {
  id: string
  userWallet: string
  predictionId: string
  predictionTitle: string
  side: 'yes' | 'no'
  amount: number
  tokensToReceive: number
  signature: string
  timestamp: string
  status: 'pending_distribution' | 'distributed' | 'failed'
}

export function TradeRecords() {
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadTradeRecords()
  }, [])

  const loadTradeRecords = () => {
    const records = JSON.parse(localStorage.getItem('tradeRecords') || '[]')
    setTradeRecords(records.reverse()) // Show newest first
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: 900,
          marginBottom: '40px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '-1px',
          background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          TRADE RECORDS
        </h1>

        <div style={{
          background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
          border: '3px solid #333333',
          padding: '30px',
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#ffff00',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            MANUAL DISTRIBUTION SYSTEM
          </h2>
          <p style={{
            color: '#cccccc',
            fontSize: '16px',
            lineHeight: 1.5,
            marginBottom: '20px',
          }}>
            All trades are sent to the KLIO wallet for manual token distribution. 
            This ensures fair and accurate allocation of prediction tokens.
          </p>
          <div style={{
            background: '#000000',
            border: '2px solid #00ff00',
            padding: '16px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            color: '#00ff00',
            wordBreak: 'break-all',
          }}>
            KLIO Wallet: DNQCaa1XgRnjQES86CwewMLqyT3GLChdv2RrpARTBb7u
          </div>
        </div>

        {tradeRecords.length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
            border: '3px solid #333333',
            padding: '60px',
            textAlign: 'center',
          }}>
            <AlertCircle size={48} color="#666666" style={{ marginBottom: '20px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#666666',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              NO TRADES YET
            </h3>
            <p style={{
              color: '#999999',
              fontSize: '16px',
            }}>
              Your trade history will appear here after you make your first prediction.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '20px',
          }}>
            {tradeRecords.map((record) => (
              <div
                key={record.id}
                style={{
                  background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
                  border: '3px solid #333333',
                  padding: '30px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = record.side === 'yes' ? '#00ff00' : '#ff0080'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333333'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      {record.predictionTitle}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        background: record.side === 'yes' ? '#00ff00' : '#ff0080',
                        color: '#000000',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        {record.side}
                      </span>
                      <span style={{
                        color: '#cccccc',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}>
                        {record.amount} SOL
                      </span>
                      <span style={{
                        color: '#ffff00',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}>
                        {record.tokensToReceive.toFixed(2)} tokens
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: record.status === 'distributed' ? '#00ff00' : '#ffff00',
                    color: '#000000',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {record.status === 'distributed' ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                    {record.status === 'distributed' ? 'DISTRIBUTED' : 'PENDING'}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px',
                }}>
                  <div>
                    <label style={{
                      color: '#999999',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      display: 'block',
                      marginBottom: '4px',
                    }}>
                      Wallet
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '14px',
                        color: '#ffffff',
                      }}>
                        {formatAddress(record.userWallet)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(record.userWallet)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#00ffff',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      color: '#999999',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      display: 'block',
                      marginBottom: '4px',
                    }}>
                      Date
                    </label>
                    <span style={{
                      fontSize: '14px',
                      color: '#ffffff',
                    }}>
                      {formatDate(record.timestamp)}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #333333',
                }}>
                  <a
                    href={`https://explorer.solana.com/tx/${record.signature}?cluster=mainnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#00ffff',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#00ffff'
                    }}
                  >
                    <ExternalLink size={16} />
                    VIEW ON EXPLORER
                  </a>
                  
                  <button
                    onClick={() => copyToClipboard(record.signature)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#999999',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#999999'
                    }}
                  >
                    <Copy size={16} />
                    COPY TX
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}