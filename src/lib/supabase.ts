import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email?: string
  phoneNumber?: string
  name: string
  role: 'ADMIN' | 'MEMBER'
}

export type Event = {
  id: string
  name: string
  description?: string
  date: Date
  location?: string
}

export type Attendance = {
  id: string
  userId: string
  eventId: string
  checkedIn: Date
} 