import { NextRequest, NextResponse } from 'next/server'
import { getUserPositions } from '@/lib/anchor-client'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const positions = getUserPositions(params.address)
    
    return NextResponse.json({
      success: true,
      data: positions,
      count: positions.length,
    })
  } catch (error: any) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
