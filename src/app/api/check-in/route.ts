import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { userId, eventId } = await request.json()

    // Check if user has already checked in
    const { data: existingCheckIn } = await supabase
      .from('Attendance')
      .select('*')
      .eq('userId', userId)
      .eq('eventId', eventId)
      .single()

    if (existingCheckIn) {
      return NextResponse.json(
        { error: 'User has already checked in for this event' },
        { status: 400 }
      )
    }

    // Create new check-in
    const { data, error } = await supabase
      .from('Attendance')
      .insert([
        {
          userId,
          eventId,
          checkedIn: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
} 