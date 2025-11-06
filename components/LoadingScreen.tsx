'use client'

import { useState, useEffect } from 'react'
import { Zap, Activity, TrendingUp } from 'lucide-react'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState(0)

  const loadingTexts = [
    'INITIALIZING PREDICTION MARKETS...',
    'CONNECTING TO SOLANA BLOCKCHAIN...',
    'LOADING TRADING ENGINE...',
    'PREPARING $KLIO ECOSYSTEM...',
    'READY TO PREDICT THE FUTURE...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      {/* Animated background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(45deg, transparent 49%, rgba(0, 255, 0, 0.05) 50%, transparent 51%),
          linear-gradient(-45deg, transparent 49%, rgba(0, 255, 255, 0.05) 50%, transparent 51%)
        `,
        backgroundSize: '60px 60px',
        animation: 'slidePattern 3s linear infinite',
      }} />

      {/* Main logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '60px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          background: '#000000',
          border: '4px solid #00ff00',
          padding: '20px',
          animation: 'pulseGlow 2s ease-in-out infinite',
        }}>
          <Zap size={48} color="#00ff00" />
        </div>
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 900,
          background: 'linear-gradient(45deg, #ffffff 0%, #00ff00 50%, #00ffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textTransform: 'uppercase',
          letterSpacing: '-2px',
          animation: 'textGlow 2s ease-in-out infinite alternate',
        }}>
          KLIO.FUN
        </h1>
      </div>

      {/* Loading text */}
      <div style={{
        marginBottom: '40px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 18px)',
          fontWeight: 600,
          color: '#00ff00',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          animation: 'fadeInOut 1s ease-in-out infinite',
        }}>
          {loadingTexts[currentText]}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 'clamp(300px, 60vw, 500px)',
        height: '8px',
        background: '#333333',
        border: '2px solid #666666',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '20px',
        zIndex: 2,
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #00ff00 0%, #00ffff 50%, #ff0080 100%)',
          transition: 'width 0.1s ease',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
            animation: 'shimmer 1.5s infinite',
          }} />
        </div>
      </div>

      {/* Progress percentage */}
      <div style={{
        fontSize: '24px',
        fontWeight: 900,
        color: '#ffffff',
        fontFamily: 'JetBrains Mono, monospace',
        position: 'relative',
        zIndex: 2,
      }}>
        {progress}%
      </div>

      {/* Floating icons */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        animation: 'float 3s ease-in-out infinite',
        opacity: 0.3,
      }}>
        <Activity size={32} color="#00ffff" />
      </div>
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        animation: 'float 3s ease-in-out infinite 1s',
        opacity: 0.3,
      }}>
        <TrendingUp size={28} color="#ff0080" />
      </div>

      <style jsx>{`
        @keyframes slidePattern {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.3);
          }
        }
        
        @keyframes textGlow {
          0% {
            text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
          }
          100% {
            text-shadow: 0 0 30px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 0, 0.3);
          }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}