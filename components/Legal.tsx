'use client'

import { Shield, FileText, AlertTriangle } from 'lucide-react'

export function Legal() {
  return (
    <div style={{ padding: '40px 20px', background: '#000000' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
          LEGAL & COMPLIANCE
        </h1>

        {/* Risk Warning */}
        <div style={{
          background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
          border: '3px solid #ff0080',
          padding: '32px',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <AlertTriangle size={32} color="#ff0080" />
            <h2 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ff0080',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}>
              RISK WARNING
            </h2>
          </div>
          <div style={{ color: '#ffffff', lineHeight: 1.6, fontSize: '16px' }}>
            <p><strong>PREDICTION MARKETS INVOLVE SIGNIFICANT FINANCIAL RISK.</strong></p>
            <ul style={{ paddingLeft: '20px', marginTop: '16px' }}>
              <li>You can lose 100% of your investment</li>
              <li>Markets are binary - winner takes all, loser gets nothing</li>
              <li>Outcomes depend on external events beyond our control</li>
              <li>Smart contract risks may affect payouts</li>
              <li>Only invest what you can afford to lose completely</li>
            </ul>
          </div>
        </div>

        {/* Terms of Service */}
        <div style={{
          background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
          border: '3px solid #00ff00',
          padding: '32px',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <FileText size={32} color="#00ff00" />
            <h2 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#00ff00',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}>
              TERMS OF SERVICE
            </h2>
          </div>
          <div style={{ color: '#ffffff', lineHeight: 1.6, fontSize: '14px' }}>
            <h3 style={{ color: '#00ff00', fontSize: '16px', marginBottom: '12px' }}>1. ACCEPTANCE OF TERMS</h3>
            <p>By using Klio.fun, you agree to these terms and all applicable laws and regulations.</p>

            <h3 style={{ color: '#00ff00', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>2. ELIGIBILITY</h3>
            <p>You must be 18+ years old and legally able to enter into contracts in your jurisdiction.</p>

            <h3 style={{ color: '#00ff00', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>3. PLATFORM DESCRIPTION</h3>
            <p>Klio.fun is a decentralized prediction market platform where users can create and trade on future events using SOL cryptocurrency.</p>

            <h3 style={{ color: '#00ff00', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>4. USER RESPONSIBILITIES</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Maintain security of your wallet and private keys</li>
              <li>Verify all transaction details before signing</li>
              <li>Comply with local laws and regulations</li>
              <li>Not engage in market manipulation or fraud</li>
            </ul>

            <h3 style={{ color: '#00ff00', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>5. PLATFORM FEES</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Market creators earn 2% of all trading volume</li>
              <li>Platform may charge additional fees for services</li>
              <li>All fees are disclosed before transactions</li>
            </ul>

            <h3 style={{ color: '#00ff00', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>6. DISCLAIMERS</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Platform provided "as is" without warranties</li>
              <li>We do not guarantee market outcomes or payouts</li>
              <li>Smart contract risks are borne by users</li>
              <li>We are not responsible for user losses</li>
            </ul>

            <h3 style={{ color: '#00ff00', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>7. LIMITATION OF LIABILITY</h3>
            <p>Our liability is limited to the maximum extent permitted by law. We are not liable for any indirect, incidental, or consequential damages.</p>
          </div>
        </div>

        {/* Privacy Policy */}
        <div style={{
          background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
          border: '3px solid #00ffff',
          padding: '32px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <Shield size={32} color="#00ffff" />
            <h2 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#00ffff',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}>
              PRIVACY POLICY
            </h2>
          </div>
          <div style={{ color: '#ffffff', lineHeight: 1.6, fontSize: '14px' }}>
            <h3 style={{ color: '#00ffff', fontSize: '16px', marginBottom: '12px' }}>DATA COLLECTION</h3>
            <p>We collect minimal data necessary for platform operation:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Wallet addresses (public blockchain data)</li>
              <li>Transaction history (public blockchain data)</li>
              <li>Basic usage analytics (anonymized)</li>
            </ul>

            <h3 style={{ color: '#00ffff', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>DATA USAGE</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Provide platform services and functionality</li>
              <li>Display trading history and positions</li>
              <li>Improve user experience and platform performance</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>

            <h3 style={{ color: '#00ffff', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>DATA SHARING</h3>
            <p>We do not sell or share personal data with third parties, except:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>As required by law or legal process</li>
              <li>To protect our rights and safety</li>
              <li>With service providers under strict confidentiality</li>
            </ul>

            <h3 style={{ color: '#00ffff', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>BLOCKCHAIN TRANSPARENCY</h3>
            <p>All transactions are recorded on the Solana blockchain and are publicly visible. This includes wallet addresses, transaction amounts, and timestamps.</p>

            <h3 style={{ color: '#00ffff', fontSize: '16px', marginBottom: '12px', marginTop: '20px' }}>CONTACT</h3>
            <p>For questions about these policies, contact us at legal@klio.fun</p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          color: '#666666',
          fontSize: '12px',
        }}>
          Last updated: November 2024 | Klio.fun - Decentralized Prediction Markets
        </div>
      </div>
    </div>
  )
}