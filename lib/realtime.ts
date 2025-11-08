// Real-time updates system for KLIO
// Provides live updates for predictions, trades, and positions

type EventType = 'prediction' | 'trade' | 'position' | 'resolution'

interface RealtimeEvent {
  type: EventType
  data: any
  timestamp: number
}

class RealtimeManager {
  private listeners: Map<EventType, Set<(data: any) => void>> = new Map()
  private eventHistory: RealtimeEvent[] = []
  private maxHistorySize = 100

  subscribe(event: EventType, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  emit(event: EventType, data: any): void {
    const realtimeEvent: RealtimeEvent = {
      type: event,
      data,
      timestamp: Date.now(),
    }

    // Add to history
    this.eventHistory.push(realtimeEvent)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }

    // Notify all listeners
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in ${event} listener:`, error)
      }
    })

    // Also notify 'all' listeners
    this.listeners.get('*' as EventType)?.forEach(callback => {
      try {
        callback(realtimeEvent)
      } catch (error) {
        console.error('Error in global listener:', error)
      }
    })
  }

  getHistory(event?: EventType): RealtimeEvent[] {
    if (event) {
      return this.eventHistory.filter(e => e.type === event)
    }
    return [...this.eventHistory]
  }

  clearHistory(): void {
    this.eventHistory = []
  }

  getListenerCount(event?: EventType): number {
    if (event) {
      return this.listeners.get(event)?.size || 0
    }
    return Array.from(this.listeners.values()).reduce(
      (sum, set) => sum + set.size,
      0
    )
  }
}

export const realtime = new RealtimeManager()

// Helper hooks for React components
export function useRealtimeEvent(
  event: EventType,
  callback: (data: any) => void,
  deps: any[] = []
) {
  if (typeof window === 'undefined') return

  const { useEffect } = require('react')
  
  useEffect(() => {
    const unsubscribe = realtime.subscribe(event, callback)
    return unsubscribe
  }, deps)
}

// Emit events for common actions
export function emitPredictionCreated(prediction: any) {
  realtime.emit('prediction', {
    action: 'created',
    prediction,
  })
}

export function emitTradeExecuted(trade: any) {
  realtime.emit('trade', {
    action: 'executed',
    trade,
  })
}

export function emitPredictionResolved(predictionId: string, outcome: boolean) {
  realtime.emit('resolution', {
    action: 'resolved',
    predictionId,
    outcome,
  })
}

export function emitPositionUpdated(position: any) {
  realtime.emit('position', {
    action: 'updated',
    position,
  })
}
