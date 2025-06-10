'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function createUserRecord(userId: string, email: string, fullName: string, phone: string) {
  try {
    const { data: userData, error: userError } = await supabaseAdmin
      .from('User')
      .insert([
        {
          id: userId,
          email: email,
          name: fullName,
          phoneNumber: phone,
          role: 'MEMBER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      throw userError;
    }

    return { data: userData, error: null };
  } catch (error) {
    console.error('Error in createUserRecord:', error);
    return { data: null, error };
  }
}

export async function fetchUserRole(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('User')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return { role: 'MEMBER' as const, error: null }; // Default to MEMBER if role not found
    }
    
    return { role: (data?.role || 'MEMBER') as 'ADMIN' | 'MEMBER', error: null };
  } catch (error) {
    console.error('Error in fetchUserRole:', error);
    return { role: 'MEMBER' as const, error };
  }
}

export async function fetchUserData(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    return { data: null, error };
  }
} 