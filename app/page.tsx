'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { CreatePredictionModal } from '@/components/CreatePredictionModal'
import { PredictionCard } from '@/components/PredictionCard'
import { Portfolio } from '@/components/Portfolio'
import { Legal } from '@/components/Legal'
import { Token } from '@/components/Token'
import { LoadingScreen } from '@/components/LoadingScreen'
import { TradeRecords } from '@/components/TradeRecords'

import { TrendingUp, Zap, Users, Trophy, Target, Rocket, Activity, BarChart3, Filter, Flame, Star, Coins } from 'lucide-react'
import { usePredictions } from '@/hooks/usePredictions'
import { useTrading } from '@/hooks/useTrading'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast, Toaster } from 'react-hot-toast'

// Initialize mock predictions in localStorage if not present
const initializeMockPredictions = () => {
  const existingPredictions = localStorage.getItem('predictions')
  if (!existingPredictions || JSON.parse(existingPredictions).length === 0) {
    const mockPredictionsData = [
      {
        address: 'mock_prediction_1',
        eventDescription: 'Will Solana hit $500 by June 2026?',
        deadline: Math.floor(new Date('2026-06-30').getTime() / 1000),
        creator: '11111111111111111111111111111112',
        oracleSource: 'CoinGecko API',
        startingOdds: 42,
        yesSupply: 420,
        noSupply: 580,
        totalVolume: 125,
        resolved: false,
        outcome: null,
        vault: '11111111111111111111111111111113',
        yesMint: 'mock_yes_1',
        noMint: 'mock_no_1',
      },
      {
        address: 'mock_prediction_2',
        eventDescription: 'AI beats humans at chess by 2030',
        deadline: Math.floor(new Date('2030-01-01').getTime() / 1000),
        creator: '11111111111111111111111111111114',
        oracleSource: 'Chess.com API',
        startingOdds: 64,
        yesSupply: 640,
        noSupply: 360,
        totalVolume: 89,
        resolved: false,
        outcome: null,
        vault: '11111111111111111111111111111115',
        yesMint: 'mock_yes_2',
        noMint: 'mock_no_2',
      },
      {
        address: 'mock_prediction_3',
        eventDescription: 'WIF hits $10 by end of 2025',
        deadline: Math.floor(new Date('2025-12-31').getTime() / 1000),
        creator: '11111111111111111111111111111116',
        oracleSource: 'DEX Screener',
        startingOdds: 28,
        yesSupply: 280,
        noSupply: 720,
        totalVolume: 67,
        resolved: false,
        outcome: null,
        vault: '11111111111111111111111111111117',
        yesMint: 'mock_yes_3',
        noMint: 'mock_no_3',
      },
      {
        address: 'mock_prediction_4',
        eventDescription: 'Tesla stock reaches $300 by Q2 2025',
        deadline: Math.floor(new Date('2025-06-30').getTime() / 1000),
        creator: '11111111111111111111111111111118',
        oracleSource: 'Yahoo Finance',
        startingOdds: 55,
        yesSupply: 550,
        noSupply: 450,
        totalVolume: 156,
        resolved: false,
        outcome: null,
        vault: '11111111111111111111111111111119',
        yesMint: 'mock_yes_4',
        noMint: 'mock_no_4',
      },
      {
        address: 'mock_prediction_5',
        eventDescription: 'Bitcoin ETF approval by end of 2024',
        deadline: Math.floor(new Date('2024-12-31').getTime() / 1000),
        creator: '1111111111111111111111111111111A',
        oracleSource: 'SEC Filings',
        startingOdds: 78,
        yesSupply: 780,
        noSupply: 220,
        totalVolume: 234,
        resolved: false,
        outcome: null,
        vault: '1111111111111111111111111111111B',
        yesMint: 'mock_yes_5',
        noMint: 'mock_no_5',
      },
      {
        address: 'mock_prediction_6',
        eventDescription: 'SpaceX lands on Mars by 2028',
        deadline: Math.floor(new Date('2028-12-31').getTime() / 1000),
        creator: '1111111111111111111111111111111C',
        oracleSource: 'SpaceX Updates',
        startingOdds: 35,
        yesSupply: 350,
        noSupply: 650,
        totalVolume: 98,
        resolved: false,
        outcome: null,
        vault: '1111111111111111111111111111111D',
        yesMint: 'mock_yes_6',
        noMint: 'mock_no_6',
      },
    ]
    localStorage.setItem('predictions', JSON.stringify(mockPredictionsData))
  }
}

const mockPredictions = [
  {
    id: 'mock_prediction_1',
    address: 'mock_prediction_1', // Ensure both id and address are the same
    event: 'Will Solana hit $500 by June 2026?',
    deadline: new Date('2026-06-30'),
    yesPrice: 0.42,
    noPrice: 0.58,
    volume: 125000,
    creator: '11111111111111111111111111111112',
    participants: 234,
    category: 'Crypto',
    trending: true,
  },
  {
    id: 'mock_prediction_2',
    address: 'mock_prediction_2',
    event: 'AI beats humans at chess by 2030',
    deadline: new Date('2030-01-01'),
    yesPrice: 0.64,
    noPrice: 0.36,
    volume: 89000,
    creator: '11111111111111111111111111111114',
    participants: 156,
    category: 'Tech',
    trending: false,
  },
  {
    id: 'mock_prediction_3',
    address: 'mock_prediction_3',
    event: 'WIF hits $10 by end of 2025',
    deadline: new Date('2025-12-31'),
    yesPrice: 0.28,
    noPrice: 0.72,
    volume: 67000,
    creator: '11111111111111111111111111111116',
    participants: 89,
    category: 'Memes',
    trending: true,
  },
  {
    id: 'mock_prediction_4',
    address: 'mock_prediction_4',
    event: 'Tesla stock reaches $300 by Q2 2025',
    deadline: new Date('2025-06-30'),
    yesPrice: 0.55,
    noPrice: 0.45,
    volume: 156000,
    creator: '11111111111111111111111111111118',
    participants: 312,
    category: 'Stocks',
    trending: false,
  },
  {
    id: 'mock_prediction_5',
    address: 'mock_prediction_5',
    event: 'Bitcoin ETF approval by end of 2024',
    deadline: new Date('2024-12-31'),
    yesPrice: 0.78,
    noPrice: 0.22,
    volume: 234000,
    creator: '1111111111111111111111111111111A',
    participants: 567,
    category: 'Crypto',
    trending: true,
  },
  {
    id: 'mock_prediction_6',
    address: 'mock_prediction_6',
    event: 'SpaceX lands on Mars by 2028',
    deadline: new Date('2028-12-31'),
    yesPrice: 0.35,
    noPrice: 0.65,
    volume: 98000,
    creator: '1111111111111111111111111111111C',
    participants: 189,
    category: 'Space',
    trending: false,
  },
]

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentView, setCurrentView] = useState('home') // 'home', 'markets', 'leaderboard', 'analytics'
  const [filteredPredictions, setFilteredPredictions] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('trending') // 'trending', 'volume', 'newest', 'ending-soon'
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const wallet = useWallet()
  const connected = mounted ? wallet.connected : false
  const { predictions, loading: predictionsLoading, error, refreshPredictions } = usePredictions()
  const { trade, createPrediction, loading: tradingLoading } = useTrading()
  
  // Fallback to mock data if no blockchain predictions are loaded yet
  const displayPredictions = predictions.length > 0 ? predictions : mockPredictions

  const categories = ['All', 'Crypto', 'Tech', 'Memes', 'Stocks', 'Space', 'Sports']

  // Initialize mock predictions on first load
  useEffect(() => {
    setMounted(true)
    initializeMockPredictions()
    
    // Debug: Log predictions after initialization
    setTimeout(() => {
      const predictions = localStorage.getItem('predictions')
      const parsedPredictions = predictions ? JSON.parse(predictions) : []
      console.log('🎯 Initialized predictions:', parsedPredictions.length)
      console.log('📋 Prediction IDs:', parsedPredictions.map((p: any) => ({ id: p.id, address: p.address })))
    }, 100)
  }, [])

  // Filter and sort predictions
  useEffect(() => {
    let filtered = displayPredictions

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Sort predictions
    switch (sortBy) {
      case 'volume':
        filtered.sort((a, b) => b.volume - a.volume)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
        break
      case 'ending-soon':
        filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        break
      case 'trending':
      default:
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
        break
    }

    setFilteredPredictions(filtered)
  }, [displayPredictions, selectedCategory, sortBy])

  const handleCreatePrediction = async (predictionData: any) => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    const deadline = new Date(predictionData.deadline)
    const result = await createPrediction(
      predictionData.event,
      deadline,
      predictionData.oracleSource,
      parseInt(predictionData.startingOdds)
    )

    if (result) {
      setShowCreateModal(false)
      refreshPredictions() // Refresh the predictions list
    }
  }

  const handleTrade = async (predictionId: string, side: 'yes' | 'no', amount: number) => {
    console.log('🎯 handleTrade called:', { predictionId, side, amount, connected })
    
    if (!connected) {
      console.log('❌ Wallet not connected')
      toast.error('Please connect your wallet first')
      return false
    }

    if (amount <= 0) {
      console.log('❌ Invalid amount:', amount)
      toast.error('Amount must be greater than 0')
      return false
    }

    try {
      console.log('📡 Calling trade function...')
      const success = await trade(predictionId, side, amount)
      console.log('✅ Trade function returned:', success)
      
      if (success) {
        refreshPredictions() // Refresh to show updated prices
        toast.success(`Successfully traded ${side.toUpperCase()} for ${amount} SOL!`)
        return true
      } else {
        console.log('❌ Trade function returned false')
        toast.error('Trade failed - please try again')
        return false
      }
    } catch (error) {
      console.error('❌ handleTrade error:', error)
      toast.error(`Trade failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }

  // Debug function to test trading without wallet
  const testTrade = () => {
    console.log('Testing trade function...')
    console.log('Available predictions:', displayPredictions.map(p => ({ id: p.id, event: p.event })))
    
    if (displayPredictions.length > 0) {
      const testPrediction = displayPredictions[0]
      console.log('Testing with prediction:', testPrediction.id)
      
      // Test the trade function
      handleTrade(testPrediction.id, 'yes', 0.1)
    }
  }

  const heroStyle = {
    background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    padding: '80px 16px',
    borderBottom: '2px solid #333333',
    '@media (min-width: 768px)': {
      padding: '120px 20px',
    },
  }

  const heroPatternStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(45deg, transparent 49%, rgba(0, 255, 0, 0.03) 50%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, rgba(0, 255, 255, 0.03) 50%, transparent 51%)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none' as const,
  }

  const titleStyle = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 900,
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    lineHeight: 0.9,
    textTransform: 'uppercase' as const,
    letterSpacing: 'clamp(-2px, -0.5vw, -3px)',
    marginBottom: '2rem',
    background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 30%, #00ffff 60%, #ff0080 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center' as const,
  }

  const primaryButtonStyle = {
    background: '#ffffff',
    color: '#000000',
    border: '3px solid #000000',
    fontWeight: 800,
    padding: 'clamp(16px, 3vw, 20px) clamp(24px, 5vw, 40px)',
    fontSize: 'clamp(14px, 3vw, 18px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: 'clamp(1px, 0.3vw, 2px)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 'fit-content',
  }

  const secondaryButtonStyle = {
    background: '#000000',
    color: '#ffffff',
    border: '3px solid #ffffff',
    fontWeight: 800,
    padding: 'clamp(16px, 3vw, 20px) clamp(24px, 5vw, 40px)',
    fontSize: 'clamp(14px, 3vw, 18px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: 'clamp(1px, 0.3vw, 2px)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 'fit-content',
  }

  const filterButtonStyle = {
    background: '#111111',
    color: '#ffffff',
    border: '2px solid #333333',
    fontWeight: 700,
    padding: '12px 24px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  }

  const activeFilterStyle = {
    ...filterButtonStyle,
    background: '#00ff00',
    color: '#000000',
    borderColor: '#00ff00',
  }

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  if (currentView === 'portfolio') {
    return (
      <div style={{ minHeight: '100vh', background: '#000000' }}>
        <Header onNavigate={setCurrentView} />
        <TradeRecords />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#ffffff',
              border: '2px solid #00ff00',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            },
            success: {
              iconTheme: {
                primary: '#00ff00',
                secondary: '#000000',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff0080',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    )
  }

  if (currentView === 'token') {
    return (
      <div style={{ minHeight: '100vh', background: '#000000' }}>
        <Header onNavigate={setCurrentView} />
        <Token />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#ffffff',
              border: '2px solid #00ff00',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            },
            success: {
              iconTheme: {
                primary: '#00ff00',
                secondary: '#000000',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff0080',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    )
  }

  if (currentView === 'about') {
    return (
      <div style={{ minHeight: '100vh', background: '#000000' }}>
        <Header onNavigate={setCurrentView} />
        <Legal />
      </div>
    )
  }

  if (currentView === 'markets') {
    return (
      <div style={{ minHeight: '100vh', background: '#000000' }}>
        <Header onNavigate={setCurrentView} />
        
        {/* Markets Header */}
        <section style={{ 
          padding: '60px 20px 40px 20px',
          background: 'linear-gradient(135deg, #111111 0%, #000000 100%)',
          borderBottom: '2px solid #333333',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 900,
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '-1px',
              background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              ALL MARKETS
            </h1>
            
            {/* Filters */}
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Filter size={20} color="#ffffff" />
                <span style={{ 
                  color: '#ffffff', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '14px',
                }}>
                  CATEGORY:
                </span>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={selectedCategory === category ? activeFilterStyle : filterButtonStyle}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ 
                color: '#ffffff', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '14px',
              }}>
                SORT BY:
              </span>
              {[
                { key: 'trending', label: 'TRENDING' },
                { key: 'volume', label: 'VOLUME' },
                { key: 'newest', label: 'NEWEST' },
                { key: 'ending-soon', label: 'ENDING SOON' },
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  style={sortBy === option.key ? activeFilterStyle : filterButtonStyle}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Markets Grid */}
        <section style={{ padding: '60px 20px', background: '#000000' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', 
              gap: 'clamp(20px, 4vw, 40px)',
              padding: '0 16px',
            }}>
              {filteredPredictions.map((prediction) => (
                <PredictionCard 
                  key={prediction.id} 
                  prediction={prediction} 
                  onTrade={handleTrade}
                />
              ))}
            </div>
            
            {filteredPredictions.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#666666',
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600,
              }}>
                NO MARKETS FOUND
              </div>
            )}
          </div>
        </section>

        {showCreateModal && (
          <CreatePredictionModal 
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreatePrediction}
          />
        )}


      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000000' }}>
      <Header onNavigate={setCurrentView} />
      
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={heroPatternStyle} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: '#000000',
            border: '2px solid #00ff00',
            padding: '12px 24px',
            marginBottom: '40px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: 700,
            fontSize: '14px',
          }}>
            <Activity style={{ color: '#00ff00' }} size={20} />
            <span style={{ color: '#00ff00' }}>LIVE PREDICTION MARKETS</span>
          </div>
          
          <h1 style={titleStyle} className="glitch">
            TRADE WHAT YOU
            <br />
            <span style={{
              background: 'linear-gradient(45deg, #00ff00 0%, #00ffff 50%, #ff0080 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              BELIEVE
            </span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(16px, 4vw, 24px)',
            fontWeight: 500,
            color: '#cccccc',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            textAlign: 'center',
            lineHeight: 1.4,
            padding: '0 16px',
          }}>
            DECENTRALIZED PREDICTION MARKETS ON SOLANA.<br />
            KNOWLEDGE IS POWER. PREDICTIONS ARE PROFIT.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(12px, 3vw, 24px)', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            padding: '0 16px',
          }}>
            <button 
              style={primaryButtonStyle}
              onClick={() => setShowCreateModal(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00ff00'
                e.currentTarget.style.borderColor = '#00ff00'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 255, 0, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.borderColor = '#000000'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Rocket size={24} />
              CREATE MARKET
            </button>
            <button 
              style={secondaryButtonStyle}
              onClick={() => setCurrentView('markets')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.color = '#000000'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Target size={20} />
              EXPLORE MARKETS
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '100px 20px', 
        background: 'linear-gradient(135deg, #111111 0%, #000000 100%)',
        borderBottom: '2px solid #333333',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', 
            gap: 'clamp(20px, 4vw, 40px)',
            padding: '0 16px',
          }}>
            {[
              { 
                icon: TrendingUp, 
                value: '1,247 SOL', 
                label: 'TOTAL VOLUME', 
                color: '#00ff00' 
              },
              { 
                icon: Users, 
                value: '2,834', 
                label: 'ACTIVE TRADERS', 
                color: '#00ffff' 
              },
              { 
                icon: Trophy, 
                value: '156', 
                label: 'MARKETS CREATED', 
                color: '#ff0080' 
              },
            ].map((stat, index) => (
              <div 
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '3px solid #000000',
                  color: '#000000',
                  padding: '40px',
                  textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)'
                  e.currentTarget.style.borderColor = stat.color
                  e.currentTarget.style.boxShadow = `0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 3px ${stat.color}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#000000'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  background: '#000000',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  border: `3px solid ${stat.color}`,
                }}>
                  <stat.icon size={36} color={stat.color} />
                </div>
                <h3 style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  marginBottom: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#000000',
                  letterSpacing: '2px',
                }}>
                  {stat.value}
                </h3>
                <p style={{ 
                  color: '#666666', 
                  fontSize: '16px', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: 0,
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Markets */}
      <section style={{ 
        padding: '100px 20px',
        background: '#000000',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
              <Flame size={48} color="#ff4000" />
              <h2 style={{
                fontSize: '4rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-2px',
                background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 30%, #00ffff 60%, #ff0080 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Inter, sans-serif',
                margin: 0,
              }}>
                TRENDING FATES
              </h2>
              <Flame size={48} color="#ff4000" />
            </div>
            <p style={{
              fontSize: '18px',
              color: '#cccccc',
              maxWidth: '600px',
              margin: '0 auto',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 500,
            }}>
              THE HOTTEST PREDICTION MARKETS RIGHT NOW
            </p>
          </div>
          
          {predictionsLoading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#00ff00',
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600,
            }}>
              <Activity size={32} color="#00ff00" style={{ marginBottom: '16px' }} />
              <br />
              LOADING LIVE MARKETS...
            </div>
          ) : error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#ff0080',
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600,
            }}>
              ERROR: {error}
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', 
              gap: 'clamp(20px, 4vw, 40px)',
              padding: '0 16px',
            }}>
              {displayPredictions.slice(0, 6).map((prediction, index) => (
                <div key={prediction.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <PredictionCard prediction={prediction} onTrade={handleTrade} />
                </div>
              ))}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <button 
              style={secondaryButtonStyle}
              onClick={() => setCurrentView('markets')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.color = '#000000'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <BarChart3 size={20} />
              VIEW ALL MARKETS
            </button>
          </div>
        </div>
      </section>

      {/* Contract Address Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #111111 0%, #000000 100%)',
        borderTop: '2px solid #333333',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
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
            $KLIO TOKEN CONTRACT
          </h2>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '3px solid #000000',
            padding: '30px',
            maxWidth: '700px',
            margin: '0 auto 40px auto',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(12px, 2.5vw, 16px)',
              fontWeight: 600,
              color: '#000000',
              wordBreak: 'break-all',
              marginBottom: '20px',
            }}>
              KLIOTokenAddress1234567890123456789012345
            </div>
            
            <div style={{
              padding: '12px',
              background: '#000000',
              border: '2px solid #ffff00',
              color: '#ffff00',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              ⚠️ TOKEN LAUNCHING SOON
            </div>
          </div>

          <button 
            onClick={() => setCurrentView('token')}
            style={{
              background: '#ffff00',
              color: '#000000',
              border: '3px solid #000000',
              fontWeight: 800,
              padding: 'clamp(16px, 3vw, 20px) clamp(24px, 5vw, 32px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000000'
              e.currentTarget.style.color = '#ffff00'
              e.currentTarget.style.borderColor = '#ffff00'
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 255, 0, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffff00'
              e.currentTarget.style.color = '#000000'
              e.currentTarget.style.borderColor = '#000000'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <Coins size={20} />
            LEARN MORE ABOUT $KLIO
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '100px 20px',
        background: '#000000',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
            border: '3px solid #333333',
            padding: '60px 40px',
            position: 'relative',
            overflow: 'hidden',
          }} className="pulse-neon">
            <h3 style={{
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 900,
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '-1px',
              background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              READY TO SHAPE THE FUTURE?
            </h3>
            <p style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              color: '#cccccc',
              marginBottom: '40px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 500,
            }}>
              CREATE YOUR FIRST PREDICTION MARKET
            </p>
            <button 
              style={{
                ...primaryButtonStyle,
                fontSize: 'clamp(16px, 3vw, 20px)',
                padding: 'clamp(20px, 4vw, 24px) clamp(32px, 6vw, 48px)',
              }}
              onClick={() => setShowCreateModal(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00ff00'
                e.currentTarget.style.borderColor = '#00ff00'
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 255, 0, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.borderColor = '#000000'
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Zap size={24} />
              START PREDICTING
            </button>
          </div>
        </div>
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <CreatePredictionModal 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePrediction}
        />
      )}

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111111',
            color: '#ffffff',
            border: '2px solid #00ff00',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          },
          success: {
            iconTheme: {
              primary: '#00ff00',
              secondary: '#000000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff0080',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  )
}