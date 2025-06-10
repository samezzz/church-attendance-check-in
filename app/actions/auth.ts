'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function createUserRecord(userId: string, email: string, fullName: string, phone: string) {
  try {
    console.log('Creating user record with service role key:', !!supabaseServiceKey);
    
    // First, let's check if the table exists
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('User')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Table check error:', tableError);
      throw new Error(`Table check failed: ${tableError.message}`);
    }

    console.log('Table exists, proceeding with insert...');
    
    const { data: userData, error: userError } = await supabaseAdmin
      .from('User')  // Using the exact table name from Prisma schema
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
      console.error('User creation error details:', {
        code: userError.code,
        message: userError.message,
        details: userError.details,
        hint: userError.hint
      });
      throw userError;
    }

    console.log('User record created successfully:', userData);
    return { data: userData, error: null };
  } catch (error) {
    console.error('Error in createUserRecord:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
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