'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Zap, Search, Menu, X, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onNavigate?: (view: string) => void
  onSearch?: (query: string) => void
}

export function Header({ onNavigate, onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleNavigation = (view: string) => {
    onNavigate?.(view)
    setMobileMenuOpen(false)
  }

  const headerStyle = {
    borderBottom: '3px solid #333333',
    background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
  }

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  }

  const logoTextStyle = {
    fontSize: 'clamp(20px, 5vw, 32px)',
    fontWeight: 900,
    background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textTransform: 'uppercase' as const,
    letterSpacing: 'clamp(1px, 0.3vw, 2px)',
  }

  const navLinkStyle = {
    color: '#ffffff',
    fontWeight: 700,
    textDecoration: 'none',
    padding: '12px 0',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontSize: '14px',
    position: 'relative' as const,
  }

  const searchInputStyle = {
    background: '#000000',
    border: '2px solid #ffffff',
    color: '#ffffff',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    fontWeight: 500,
    width: 'clamp(200px, 25vw, 300px)',
    padding: '12px 16px 12px 48px',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  }

  return (
    <header style={headerStyle}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(12px, 3vw, 20px)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={logoStyle}>
            <div style={{ 
              position: 'relative',
              background: '#000000',
              border: '3px solid #00ff00',
              padding: '8px',
            }}>
              <Zap style={{ color: '#00ff00' }} size={32} />
            </div>
            <span style={logoTextStyle} className="glitch">KLIO.FUN</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
          }} className="hidden lg:flex">
            <button 
              onClick={() => handleNavigation('home')}
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00ff00'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              HOME
            </button>
            <button 
              onClick={() => handleNavigation('markets')}
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00ff00'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              MARKETS
            </button>
            <button 
              onClick={() => handleNavigation('portfolio')}
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00ffff'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              PORTFOLIO
            </button>
            <button 
              onClick={() => handleNavigation('leaderboard')}
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ff0080'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              LEADERBOARD
            </button>
            <button 
              onClick={() => handleNavigation('about')}
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffff00'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              ABOUT
            </button>
          </nav>

          {/* Right side */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }} className="hidden md:block">
              <Search 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#ffffff',
                }} 
                size={20} 
              />
              <input
                type="text"
                placeholder="SEARCH PREDICTIONS..."
                value={searchQuery}
                onChange={handleSearch}
                style={searchInputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00ff00'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 255, 0, 0.2)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              />
            </div>
            
            {/* Live indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#000000',
              border: '2px solid #00ff00',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#00ff00',
            }}>
              <Activity size={16} />
              LIVE
            </div>
            
            {/* Wallet */}
            {mounted && <WalletMultiButton />}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                color: '#ffffff',
                background: '#000000',
                border: '2px solid #ffffff',
                cursor: 'pointer',
                padding: '12px',
                transition: 'all 0.2s ease',
              }}
              className="lg:hidden"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#000000'
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.background = '#000000'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '2px solid #333333',
          }} className="lg:hidden">
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              <button onClick={() => handleNavigation('home')} style={navLinkStyle}>HOME</button>
              <button onClick={() => handleNavigation('markets')} style={navLinkStyle}>MARKETS</button>
              <button onClick={() => handleNavigation('portfolio')} style={navLinkStyle}>PORTFOLIO</button>
              <button onClick={() => handleNavigation('leaderboard')} style={navLinkStyle}>LEADERBOARD</button>
              <button onClick={() => handleNavigation('about')} style={navLinkStyle}>ABOUT</button>
              
              {/* Mobile search */}
              <div style={{ position: 'relative', marginTop: '16px' }}>
                <Search 
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#ffffff',
                  }} 
                  size={20} 
                />
                <input
                  type="text"
                  placeholder="SEARCH PREDICTIONS..."
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{
                    ...searchInputStyle,
                    width: '100%',
                  }}
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}