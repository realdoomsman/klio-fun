import { NextRequest, NextResponse } from 'next/server'
import { getAllPredictions } from '@/lib/anchor-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const predictions = getAllPredictions()
    
    return NextResponse.json({
      success: true,
      data: predictions,
      count: predictions.length,
    })
  } catch (error: any) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventDescription, deadline, oracleSource, startingOdds, creator } = body

    if (!eventDescription || !deadline || !creator) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store prediction in localStorage (in production, this would be a database)
    const predictions = getAllPredictions()
    const newPrediction = {
      address: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventDescription,
      deadline: Math.floor(new Date(deadline).getTime() / 1000),
      oracleSource: oracleSource || 'Manual',
      startingOdds: startingOdds || 5000,
      creator,
      yesMint: `yes_${Date.now()}`,
      noMint: `no_${Date.now()}`,
      vault: `vault_${Date.now()}`,
      yesSupply: 0,
      noSupply: 0,
      totalVolume: 0,
      resolved: false,
      outcome: null,
      createdAt: Math.floor(Date.now() / 1000),
    }

    predictions.push(newPrediction)
    
    return NextResponse.json({
      success: true,
      data: newPrediction,
    })
  } catch (error: any) {
    console.error('Error creating prediction:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
