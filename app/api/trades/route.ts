import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const trades = JSON.parse(localStorage?.getItem('trades') || '[]')
    
    return NextResponse.json({
      success: true,
      data: trades,
      count: trades.length,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { predictionId, user, side, amount, tokensReceived, signature } = body

    if (!predictionId || !user || !side || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const trade = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      predictionId,
      user,
      side,
      amount,
      tokensReceived,
      signature,
      timestamp: Date.now(),
    }

    return NextResponse.json({
      success: true,
      data: trade,
    })
  } catch (error: any) {
    console.error('Error recording trade:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
