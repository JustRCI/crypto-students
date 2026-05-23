import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(request) {
    try {
        const { email, password, fullName } = await request.json();
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { full_name: fullName }
            }
        });

        if (error) throw error;
        
        return NextResponse.json({ 
            message: 'Pendaftaran berhasil! Silakan cek email anda untuk verifikasi.', 
            data 
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
