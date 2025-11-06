import { useState, useCallback } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { toast } from 'react-hot-toast'
import { createPrediction, buyTokens, resolvePrediction } from '@/lib/anchor-client'

export function useTrading() {
  const [loading, setLoading] = useState(false)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const trade = useCallback(async (
    predictionAddress: string, 
    side: 'yes' | 'no', 
    amount: number
  ) => {
    if (!publicKey || !sendTransaction) {
      toast.error('Please connect your wallet first')
      return false
    }

    console.log('Wallet status:', { 
      publicKey: publicKey.toString(), 
      sendTransaction: !!sendTransaction,
      connection: !!connection 
    })

    if (amount <= 0) {
      toast.error('Amount must be greater than 0')
      return false
    }

    try {
      setLoading(true)
      
      toast.loading(`Placing ${side.toUpperCase()} trade for ${amount} SOL...`, {
        id: 'trade-loading'
      })

      console.log('🎯 Starting trade:', { predictionAddress, side, amount })
      
      if (!predictionAddress || !side || !amount) {
        throw new Error('Missing required trade parameters')
      }

      // Check if prediction exists in localStorage
      const predictions = JSON.parse(localStorage.getItem('predictions') || '[]')
      let prediction = predictions.find((p: any) => p.address === predictionAddress)
      
      // If not found by address, try by id (for mock predictions)
      if (!prediction) {
        prediction = predictions.find((p: any) => p.id === predictionAddress)
        console.log('📊 Found prediction by ID:', prediction ? 'YES' : 'NO')
      }
      
      console.log('🔍 Debug info:')
      console.log('- Looking for:', predictionAddress)
      console.log('- Found prediction:', prediction ? 'YES' : 'NO')
      console.log('- Total predictions:', predictions.length)
      console.log('- Available IDs:', predictions.map((p: any) => p.id || p.address))
      
      if (!prediction) {
        throw new Error(`Prediction not found: ${predictionAddress}`)
      }
      
      console.log('📡 Calling buyTokens function...')
      const result = await buyTokens(
        connection,
        { publicKey, sendTransaction },
        predictionAddress,
        side,
        amount
      )

      console.log('✅ buyTokens returned:', result)

      if (!result) {
        throw new Error('buyTokens returned null/undefined')
      }

      if (!result.signature) {
        throw new Error('No transaction signature in result')
      }

      toast.success(
        `Successfully traded ${side.toUpperCase()} for ${amount} SOL! Received ${result.tokensReceived.toFixed(2)} tokens`, 
        { id: 'trade-loading' }
      )

      console.log('🎉 Trade signature:', result.signature)
      console.log('🪙 Tokens received:', result.tokensReceived)
      return true

    } catch (error: any) {
      console.error('Trade error:', error)
      
      let errorMessage = 'Trade failed'
      
      if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient SOL balance'
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled'
      } else if (error.message?.includes('not found')) {
        errorMessage = 'Market not found'
      }

      toast.error(errorMessage, { id: 'trade-loading' })
      return false

    } finally {
      setLoading(false)
    }
  }, [publicKey, sendTransaction, connection])

  const createPredictionMarket = useCallback(async (
    eventDescription: string,
    deadline: Date,
    oracleSource: string,
    startingOdds: number
  ) => {
    if (!publicKey || !sendTransaction) {
      toast.error('Please connect your wallet first')
      return null
    }

    if (!eventDescription.trim()) {
      toast.error('Event description is required')
      return null
    }

    if (deadline <= new Date()) {
      toast.error('Deadline must be in the future')
      return null
    }

    try {
      setLoading(true)
      
      toast.loading('Creating prediction market...', {
        id: 'create-loading'
      })

      const result = await createPrediction(
        connection,
        { publicKey, sendTransaction },
        eventDescription,
        deadline,
        oracleSource,
        startingOdds
      )

      toast.success(
        'Prediction market created successfully!', 
        { id: 'create-loading' }
      )

      console.log('Creation signature:', result.signature)
      console.log('Prediction address:', result.predictionAddress)
      
      return result.predictionAddress

    } catch (error: any) {
      console.error('Creation error:', error)
      
      let errorMessage = 'Failed to create prediction'
      
      if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient SOL for transaction fees'
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled'
      }

      toast.error(errorMessage, { id: 'create-loading' })
      return null

    } finally {
      setLoading(false)
    }
  }, [publicKey, sendTransaction, connection])

  const resolvePredictionMarket = useCallback(async (
    predictionAddress: string,
    outcome: boolean
  ) => {
    if (!publicKey || !sendTransaction) {
      toast.error('Please connect your wallet first')
      return false
    }

    try {
      setLoading(true)
      
      toast.loading('Resolving prediction...', {
        id: 'resolve-loading'
      })

      const signature = await resolvePrediction(
        connection,
        { publicKey, sendTransaction },
        predictionAddress,
        outcome
      )

      toast.success(
        `Prediction resolved: ${outcome ? 'YES' : 'NO'}`, 
        { id: 'resolve-loading' }
      )

      console.log('Resolution signature:', signature)
      return true

    } catch (error: any) {
      console.error('Resolution error:', error)
      
      let errorMessage = 'Failed to resolve prediction'
      
      if (error.message?.includes('Only creator')) {
        errorMessage = 'Only the creator can resolve this prediction'
      } else if (error.message?.includes('already resolved')) {
        errorMessage = 'Prediction already resolved'
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled'
      }

      toast.error(errorMessage, { id: 'resolve-loading' })
      return false

    } finally {
      setLoading(false)
    }
  }, [publicKey, sendTransaction, connection])

  return {
    trade,
    createPrediction: createPredictionMarket,
    resolvePrediction: resolvePredictionMarket,
    loading,
    connected: !!publicKey,
    publicKey: publicKey?.toString(),
  }
}