import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { getAllPredictions, calculatePrice } from '@/lib/anchor-client'

export interface Prediction {
  id: string
  address: string
  event: string
  deadline: Date
  yesPrice: number
  noPrice: number
  volume: number
  creator: string
  participants: number
  category?: string
  trending?: boolean
  resolved?: boolean
  outcome?: boolean
  yesSupply?: number
  noSupply?: number
}

function inferCategory(eventDescription: string): string {
  const text = eventDescription.toLowerCase()
  
  if (text.includes('bitcoin') || text.includes('btc') || text.includes('ethereum') || 
      text.includes('eth') || text.includes('solana') || text.includes('sol') ||
      text.includes('crypto') || text.includes('coin')) {
    return 'Crypto'
  }
  
  if (text.includes('ai') || text.includes('artificial intelligence') || 
      text.includes('tech') || text.includes('software') || text.includes('app')) {
    return 'Tech'
  }
  
  if (text.includes('tesla') || text.includes('stock') || text.includes('share') ||
      text.includes('nasdaq') || text.includes('s&p')) {
    return 'Stocks'
  }
  
  if (text.includes('spacex') || text.includes('mars') || text.includes('space') ||
      text.includes('rocket') || text.includes('nasa')) {
    return 'Space'
  }
  
  if (text.includes('meme') || text.includes('doge') || text.includes('shib') ||
      text.includes('pepe') || text.includes('wif')) {
    return 'Memes'
  }
  
  if (text.includes('football') || text.includes('soccer') || text.includes('basketball') ||
      text.includes('sports') || text.includes('olympics')) {
    return 'Sports'
  }
  
  return 'Other'
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchPredictions = useCallback(async () => {
    if (!mounted) return
    
    try {
      setLoading(true)
      setError(null)

      // Get predictions from localStorage (in production, this would be from blockchain)
      const storedPredictions = getAllPredictions()
      
      const formattedPredictions: Prediction[] = storedPredictions.map((pred: any) => ({
        id: pred.address,
        address: pred.address,
        event: pred.eventDescription,
        deadline: new Date(pred.deadline * 1000),
        yesPrice: calculatePrice(pred.yesSupply, pred.noSupply, 'yes'),
        noPrice: calculatePrice(pred.yesSupply, pred.noSupply, 'no'),
        volume: pred.totalVolume,
        creator: pred.creator,
        participants: Math.floor(Math.random() * 100) + 10, // Mock participants
        category: inferCategory(pred.eventDescription),
        trending: pred.totalVolume > 1, // Markets with >1 SOL volume are trending
        resolved: pred.resolved,
        outcome: pred.outcome,
        yesSupply: pred.yesSupply,
        noSupply: pred.noSupply,
      }))

      setPredictions(formattedPredictions)
    } catch (err) {
      console.error('Error fetching predictions:', err)
      setError('Failed to fetch predictions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchPredictions()
      
      // Refresh every 10 seconds to show live updates
      const interval = setInterval(fetchPredictions, 10000)
      return () => clearInterval(interval)
    }
  }, [fetchPredictions, mounted])

  const refreshPredictions = useCallback(() => {
    fetchPredictions()
  }, [fetchPredictions])

  return {
    predictions,
    loading,
    error,
    refreshPredictions,
  }
}

export function usePrediction(address: string) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrediction = useCallback(async () => {
    if (!address) return

    try {
      setLoading(true)
      setError(null)

      const predictions = getAllPredictions()
      const pred = predictions.find((p: any) => p.address === address)
      
      if (pred) {
        const formattedPrediction: Prediction = {
          id: pred.address,
          address: pred.address,
          event: pred.eventDescription,
          deadline: new Date(pred.deadline * 1000),
          yesPrice: calculatePrice(pred.yesSupply, pred.noSupply, 'yes'),
          noPrice: calculatePrice(pred.yesSupply, pred.noSupply, 'no'),
          volume: pred.totalVolume,
          creator: pred.creator,
          participants: Math.floor(Math.random() * 100) + 10,
          category: inferCategory(pred.eventDescription),
          trending: pred.totalVolume > 1,
          resolved: pred.resolved,
          outcome: pred.outcome,
          yesSupply: pred.yesSupply,
          noSupply: pred.noSupply,
        }
        setPrediction(formattedPrediction)
      } else {
        setError('Prediction not found')
      }
    } catch (err) {
      console.error('Error fetching prediction:', err)
      setError('Failed to fetch prediction')
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchPrediction()
  }, [fetchPrediction])

  const refreshPrediction = useCallback(() => {
    fetchPrediction()
  }, [fetchPrediction])

  return {
    prediction,
    loading,
    error,
    refreshPrediction,
  }
}