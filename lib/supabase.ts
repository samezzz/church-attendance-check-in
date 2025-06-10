import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for public operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Only create admin client if we're on the server side
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : null

export type User = {
  id: string
  email?: string
  phoneNumber?: string
  name: string
  role: 'ADMIN' | 'MEMBER'
  createdAt: string
  updatedAt: string
} 