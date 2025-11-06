'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, Users, Trophy, Info, Calculator } from 'lucide-react'

export function PayoutExplainer() {
  const [selectedScenario, setSelectedScenario] = useState<'yes' | 'no'>('yes')
  
  // Example market state
  const marketState = {
    question: "Will SOL hit $500 by Dec 2024?",
    yesTokens: 50,
    noTokens: 30,
    vaultBalance: 80, // SOL
    userTrade: 10, // SOL
  }

  const calculateTrade = () => {
    const baseLiquidity = 100
    const totalSupply = marketState.yesTokens + marketState.noTokens + baseLiquidity
    const yesPrice = marketState.yesTokens / totalSupply
    const tokensReceived = marketState.userTrade / yesPrice
    const newYesSupply = marketState.yesTokens + tokensReceived
    const newVaultBalance = marketState.vaultBalance + (marketState.userTrade * 0.98) // After 2% fee
    
    return {
      yesPrice: yesPrice.toFixed(3),
      tokensReceived: tokensReceived.toFixed(1),
      newYesSupply: newYesSupply.toFixed(1),
      newVaultBalance: newVaultBalance.toFixed(1),
      payoutIfYes: ((newVaultBalance / newYesSupply) * tokensReceived).toFixed(1),
      profitIfYes: (((newVaultBalance / newYesSupply) * tokensReceived) - marketState.userTrade).toFixed(1),
    }
  }

  const trade = calculateTrade()

  return (
    <div style={{
      background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
      border: '3px solid #333333',
      padding: '40px',
      margin: '40px 0',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <Calculator size={32} color="#00ff00" />
        <h2 style={{
          fontSize: '28px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#ffffff',
          margin: 0,
        }}>
          PAYOUT CALCULATOR
        </h2>
      </div>

      {/* Market Info */}
      <div style={{
        background: '#000000',
        border: '2px solid #333333',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <h3 style={{
          color: '#00ff00',
          fontSize: '18px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '16px',
        }}>
          MARKET STATE
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          fontSize: '14px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <div>
            <span style={{ color: '#cccccc' }}>QUESTION:</span>
            <br />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{marketState.question}</span>
          </div>
          <div>
            <span style={{ color: '#cccccc' }}>YES TOKENS:</span>
            <br />
            <span style={{ color: '#00ff00', fontWeight: 700 }}>{marketState.yesTokens}</span>
          </div>
          <div>
            <span style={{ color: '#cccccc' }}>NO TOKENS:</span>
            <br />
            <span style={{ color: '#ff0080', fontWeight: 700 }}>{marketState.noTokens}</span>
          </div>
          <div>
            <span style={{ color: '#cccccc' }}>VAULT BALANCE:</span>
            <br />
            <span style={{ color: '#00ffff', fontWeight: 700 }}>{marketState.vaultBalance} SOL</span>
          </div>
        </div>
      </div>

      {/* Trade Simulation */}
      <div style={{
        background: '#000000',
        border: '2px solid #00ff00',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <h3 style={{
          color: '#00ff00',
          fontSize: '18px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '16px',
        }}>
          YOUR TRADE: {marketState.userTrade} SOL → YES TOKENS
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          fontSize: '14px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <div>
            <span style={{ color: '#cccccc' }}>YES TOKEN PRICE:</span>
            <br />
            <span style={{ color: '#00ff00', fontWeight: 700 }}>{trade.yesPrice} SOL</span>
          </div>
          <div>
            <span style={{ color: '#cccccc' }}>TOKENS RECEIVED:</span>
            <br />
            <span style={{ color: '#00ff00', fontWeight: 700 }}>{trade.tokensReceived} YES</span>
          </div>
          <div>
            <span style={{ color: '#cccccc' }}>CREATOR FEE:</span>
            <br />
            <span style={{ color: '#ffff00', fontWeight: 700 }}>{(marketState.userTrade * 0.02).toFixed(2)} SOL</span>
          </div>
          <div>
            <span style={{ color: '#cccccc' }}>TO VAULT:</span>
            <br />
            <span style={{ color: '#00ffff', fontWeight: 700 }}>{(marketState.userTrade * 0.98).toFixed(2)} SOL</span>
          </div>
        </div>
      </div>

      {/* Payout Scenarios */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <button
          onClick={() => setSelectedScenario('yes')}
          style={{
            background: selectedScenario === 'yes' ? '#00ff00' : '#000000',
            color: selectedScenario === 'yes' ? '#000000' : '#00ff00',
            border: '2px solid #00ff00',
            padding: '12px 24px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          IF RESOLVES YES
        </button>
        <button
          onClick={() => setSelectedScenario('no')}
          style={{
            background: selectedScenario === 'no' ? '#ff0080' : '#000000',
            color: selectedScenario === 'no' ? '#ffffff' : '#ff0080',
            border: '2px solid #ff0080',
            padding: '12px 24px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          IF RESOLVES NO
        </button>
      </div>

      {/* Payout Details */}
      <div style={{
        background: selectedScenario === 'yes' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 128, 0.1)',
        border: `2px solid ${selectedScenario === 'yes' ? '#00ff00' : '#ff0080'}`,
        padding: '24px',
      }}>
        {selectedScenario === 'yes' ? (
          <>
            <h3 style={{
              color: '#00ff00',
              fontSize: '20px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}>
              🎉 MARKET RESOLVES YES - YOU WIN!
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              fontSize: '16px',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              <div>
                <span style={{ color: '#cccccc' }}>YOUR YES TOKENS:</span>
                <br />
                <span style={{ color: '#00ff00', fontWeight: 700 }}>{trade.tokensReceived}</span>
              </div>
              <div>
                <span style={{ color: '#cccccc' }}>PAYOUT PER TOKEN:</span>
                <br />
                <span style={{ color: '#00ff00', fontWeight: 700 }}>
                  {(parseFloat(trade.newVaultBalance) / parseFloat(trade.newYesSupply)).toFixed(3)} SOL
                </span>
              </div>
              <div>
                <span style={{ color: '#cccccc' }}>TOTAL PAYOUT:</span>
                <br />
                <span style={{ color: '#00ff00', fontWeight: 700, fontSize: '20px' }}>
                  {trade.payoutIfYes} SOL
                </span>
              </div>
              <div>
                <span style={{ color: '#cccccc' }}>YOUR PROFIT:</span>
                <br />
                <span style={{ 
                  color: parseFloat(trade.profitIfYes) > 0 ? '#00ff00' : '#ff0080', 
                  fontWeight: 700,
                  fontSize: '20px'
                }}>
                  {trade.profitIfYes > '0' ? '+' : ''}{trade.profitIfYes} SOL
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 style={{
              color: '#ff0080',
              fontSize: '20px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}>
              💀 MARKET RESOLVES NO - YOU LOSE
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              fontSize: '16px',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              <div>
                <span style={{ color: '#cccccc' }}>YOUR YES TOKENS:</span>
                <br />
                <span style={{ color: '#666666', fontWeight: 700 }}>{trade.tokensReceived} (WORTHLESS)</span>
              </div>
              <div>
                <span style={{ color: '#cccccc' }}>PAYOUT PER TOKEN:</span>
                <br />
                <span style={{ color: '#666666', fontWeight: 700 }}>0 SOL</span>
              </div>
              <div>
                <span style={{ color: '#cccccc' }}>TOTAL PAYOUT:</span>
                <br />
                <span style={{ color: '#ff0080', fontWeight: 700, fontSize: '20px' }}>
                  0 SOL
                </span>
              </div>
              <div>
                <span style={{ color: '#cccccc' }}>YOUR LOSS:</span>
                <br />
                <span style={{ color: '#ff0080', fontWeight: 700, fontSize: '20px' }}>
                  -{marketState.userTrade} SOL
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Key Points */}
      <div style={{
        background: '#000000',
        border: '2px solid #00ffff',
        padding: '24px',
        marginTop: '32px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <Info size={24} color="#00ffff" />
          <h3 style={{
            color: '#00ffff',
            fontSize: '18px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0,
          }}>
            KEY POINTS
          </h3>
        </div>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '14px',
          lineHeight: 1.6,
        }}>
          <li style={{ marginBottom: '8px', color: '#cccccc' }}>
            • <strong style={{ color: '#ffffff' }}>Winner takes all:</strong> Winning side splits the entire vault
          </li>
          <li style={{ marginBottom: '8px', color: '#cccccc' }}>
            • <strong style={{ color: '#ffffff' }}>Early advantage:</strong> Earlier traders get better prices
          </li>
          <li style={{ marginBottom: '8px', color: '#cccccc' }}>
            • <strong style={{ color: '#ffffff' }}>Creator fees:</strong> 2% of all trades go to market creator
          </li>
          <li style={{ marginBottom: '8px', color: '#cccccc' }}>
            • <strong style={{ color: '#ffffff' }}>Automatic payouts:</strong> Smart contract handles all distributions
          </li>
          <li style={{ color: '#cccccc' }}>
            • <strong style={{ color: '#ffffff' }}>No counterparty risk:</strong> Funds locked in smart contract
          </li>
        </ul>
      </div>
    </div>
  )
}