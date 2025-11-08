import { NextRequest, NextResponse } from 'next/server'
import { getAllPredictions } from '@/lib/anchor-client'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const predictions = getAllPredictions()
    const prediction = predictions.find(
      (p: any) => p.address === params.id || p.id === params.id
    )

    if (!prediction) {
      return NextResponse.json(
        { success: false, error: 'Prediction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: prediction,
    })
  } catch (error: any) {
    console.error('Error fetching prediction:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const predictions = getAllPredictions()
    const index = predictions.findIndex(
      (p: any) => p.address === params.id || p.id === params.id
    )

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Prediction not found' },
        { status: 404 }
      )
    }

    predictions[index] = { ...predictions[index], ...body }

    return NextResponse.json({
      success: true,
      data: predictions[index],
    })
  } catch (error: any) {
    console.error('Error updating prediction:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
