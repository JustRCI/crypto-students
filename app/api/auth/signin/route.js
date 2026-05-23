import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (authError) throw authError;

        let role = 'user';
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            console.warn("Profile fetch error:", profileError);
            // Fallback to default role if profile table is missing or errors
        } else if (profileData) {
            role = profileData.role;
        }

        return NextResponse.json({ 
            message: 'Login Berhasil!', 
            session: authData.session,
            role: role
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
