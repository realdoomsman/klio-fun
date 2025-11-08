// Database abstraction layer for KLIO
// Currently uses localStorage, can be upgraded to PostgreSQL/MongoDB

export interface DatabasePrediction {
  address: string
  id: string
  eventDescription: string
  deadline: number
  oracleSource: string
  startingOdds: number
  creator: string
  yesMint: string
  noMint: string
  vault: string
  yesSupply: number
  noSupply: number
  totalVolume: number
  resolved: boolean
  outcome: boolean | null
  createdAt: number
}

export interface DatabaseTrade {
  id: string
  predictionId: string
  user: string
  side: 'yes' | 'no'
  amount: number
  tokensReceived: number
  signature: string
  timestamp: number
}

export interface DatabasePosition {
  prediction: string
  user: string
  yesTokens: number
  noTokens: number
  totalInvested: number
  claimed?: boolean
  payout?: number
}

class Database {
  private isServer = typeof window === 'undefined'

  // Predictions
  getPredictions(): DatabasePrediction[] {
    if (this.isServer) return []
    try {
      return JSON.parse(localStorage.getItem('predictions') || '[]')
    } catch {
      return []
    }
  }

  getPrediction(id: string): DatabasePrediction | null {
    const predictions = this.getPredictions()
    return predictions.find(p => p.address === id || p.id === id) || null
  }

  savePrediction(prediction: DatabasePrediction): void {
    if (this.isServer) return
    const predictions = this.getPredictions()
    const index = predictions.findIndex(p => p.address === prediction.address)
    
    if (index >= 0) {
      predictions[index] = prediction
    } else {
      predictions.push(prediction)
    }
    
    localStorage.setItem('predictions', JSON.stringify(predictions))
    this.notifyUpdate('predictions', prediction)
  }

  updatePrediction(id: string, updates: Partial<DatabasePrediction>): void {
    if (this.isServer) return
    const predictions = this.getPredictions()
    const index = predictions.findIndex(p => p.address === id || p.id === id)
    
    if (index >= 0) {
      predictions[index] = { ...predictions[index], ...updates }
      localStorage.setItem('predictions', JSON.stringify(predictions))
      this.notifyUpdate('predictions', predictions[index])
    }
  }

  // Trades
  getTrades(): DatabaseTrade[] {
    if (this.isServer) return []
    try {
      return JSON.parse(localStorage.getItem('trades') || '[]')
    } catch {
      return []
    }
  }

  getTradesByPrediction(predictionId: string): DatabaseTrade[] {
    return this.getTrades().filter(t => t.predictionId === predictionId)
  }

  getTradesByUser(userAddress: string): DatabaseTrade[] {
    return this.getTrades().filter(t => t.user === userAddress)
  }

  saveTrade(trade: DatabaseTrade): void {
    if (this.isServer) return
    const trades = this.getTrades()
    trades.push(trade)
    localStorage.setItem('trades', JSON.stringify(trades))
    this.notifyUpdate('trades', trade)
  }

  // Positions
  getPositions(): DatabasePosition[] {
    if (this.isServer) return []
    try {
      return JSON.parse(localStorage.getItem('userPositions') || '[]')
    } catch {
      return []
    }
  }

  getUserPositions(userAddress: string): DatabasePosition[] {
    return this.getPositions().filter(p => p.user === userAddress)
  }

  getPositionsByPrediction(predictionId: string): DatabasePosition[] {
    return this.getPositions().filter(p => p.prediction === predictionId)
  }

  savePosition(position: DatabasePosition): void {
    if (this.isServer) return
    const positions = this.getPositions()
    const index = positions.findIndex(
      p => p.prediction === position.prediction && p.user === position.user
    )
    
    if (index >= 0) {
      positions[index] = position
    } else {
      positions.push(position)
    }
    
    localStorage.setItem('userPositions', JSON.stringify(positions))
    this.notifyUpdate('positions', position)
  }

  // Real-time updates
  private listeners: Map<string, Set<Function>> = new Map()

  subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  private notifyUpdate(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('Error in database listener:', error)
      }
    })
  }

  // Analytics
  getStats() {
    const predictions = this.getPredictions()
    const trades = this.getTrades()
    const positions = this.getPositions()

    const totalVolume = predictions.reduce((sum, p) => sum + p.totalVolume, 0)
    const activePredictions = predictions.filter(p => !p.resolved).length
    const resolvedPredictions = predictions.filter(p => p.resolved).length
    const totalTrades = trades.length
    const uniqueTraders = new Set(trades.map(t => t.user)).size

    return {
      totalPredictions: predictions.length,
      activePredictions,
      resolvedPredictions,
      totalVolume,
      totalTrades,
      uniqueTraders,
      totalPositions: positions.length,
    }
  }

  // Clear all data (for testing)
  clearAll(): void {
    if (this.isServer) return
    localStorage.removeItem('predictions')
    localStorage.removeItem('trades')
    localStorage.removeItem('userPositions')
    this.notifyUpdate('clear', null)
  }
}

export const db = new Database()
