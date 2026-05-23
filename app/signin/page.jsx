'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { showAlert } from '@/utils/alert';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function SignInPage() {
    const router = useRouter();
    const [isSignin, setIsSignin] = useState(false);
    
    // Form states
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    
    const [signinEmail, setSigninEmail] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);

    const activeClasses = "bg-purple-600 md:bg-[#0a051a] text-white px-6 py-2 rounded-full font-bold transition-all duration-300 hover:scale-105";
    const inactiveClasses = "text-gray-300 md:text-gray-600 bg-transparent px-6 py-2 rounded-full font-bold hover:text-white md:hover:text-black transition-all duration-300";

    const handleSignup = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: signupEmail,
                password: signupPassword,
                options: {
                    data: { full_name: signupName }
                }
            });

            if (error) {
                showAlert("Pendaftaran gagal: " + error.message, "danger");
            } else {
                showAlert("Pendaftaran berhasil. Silakan periksa email Anda untuk memverifikasi akun.", "success");
                setSignupName('');
                setSignupEmail('');
                setSignupPassword('');
            }
        } catch (err) {
            console.error("Client Error:", err);
            showAlert("Gagal terhubung ke peladen Supabase.", "danger");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: signinEmail,
                password: signinPassword
            });

            if (authError) {
                showAlert("Masuk gagal: " + authError.message, "danger");
                setIsLoading(false);
                return;
            } else {
                let role = 'user';
                let fullName = authData.user.user_metadata?.full_name || 'User';

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('role, full_name')
                    .eq('id', authData.user.id)
                    .single();
                
                if (profileError) {
                    console.error("Error fetching profile:", profileError);
                    showAlert("Peringatan: Gagal memuat data profil. Menggunakan peran bawaan 'Pengguna'.", "warning");
                }

                if (profileData) {
                    role = profileData.role || 'user';
                    if (profileData.full_name) {
                        fullName = profileData.full_name;
                    }
                }

                const roleText = role === 'admin' ? 'ADMINISTRATOR' : 'USER';
                showAlert("Berhasil masuk sebagai " + roleText + ".", "success");

                localStorage.setItem('userSession', JSON.stringify(authData.session));
                localStorage.setItem('userRole', role);
                localStorage.setItem('userName', fullName);
                
                setTimeout(() => {
                    if (role === 'admin') {
                        router.push("/admin"); 
                    } else {
                        router.push("/dashboard");
                    }
                }, 2000);
            }
        } catch (err) {
            console.error("Client Error:", err);
            showAlert("Gagal connect ke Server Supabase!", "danger");
            setIsLoading(false);
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-left {
                    0% { opacity: 0; transform: translateX(-20px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
                .animate-fade-in-left { animation: fade-in-left 0.8s ease-out forwards; }
                .animate-bounce-slow { animation: bounce-slow 3s infinite; }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
            `}} />
            
            <div className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#0a051a] md:bg-[#d1d5db]">
                
                <div className="hidden md:flex relative w-[60%] bg-[#0a051a] flex-col p-12 z-10 animate-fade-in-left"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0% 100%)' }}>
                    
                    <nav className="flex items-center space-x-12 w-full animate-fade-in-down z-10">
                        <Link href="/" className="max-[850px]:hidden">
                            <img src="/img/icon.png" alt="Logo" className="h-24 w-auto" />
                        </Link>
                        <div className="flex space-x-8">
                            <Link href="/" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">Home</Link>
                            <Link href="/about" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">About</Link>
                            <Link href="/service" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">Service</Link>
                            <Link href="/contact" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">Contact</Link>
                        </div>
                    </nav>

                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 blur-[120px] rounded-full z-0"></div>
                </div>

                <div className="relative md:absolute md:right-0 w-full md:w-[50%] h-screen md:h-full flex flex-col justify-center px-6 md:px-12 xl:pl-40 xl:pr-20 z-20 pointer-events-none bg-[#0a051a] md:bg-transparent pt-10 md:pt-0">
                    
                    {/* Mobile Logo & Nav */}
                    <div className="md:hidden flex justify-center mb-8 pointer-events-auto">
                        <Link href="/">
                            <img src="/img/icon.png" alt="Logo" className="h-24 w-auto" />
                        </Link>
                    </div>

                    <div className="flex space-x-4 mb-8 border-b border-gray-600 md:border-gray-400 pb-2 w-fit mx-auto md:mx-0 pointer-events-auto">
                        <button 
                            id="btn-register" 
                            onClick={() => setIsSignin(false)} 
                            className={!isSignin ? activeClasses : inactiveClasses}
                        >
                            Sign Up
                        </button>
                        <button 
                            id="btn-signin" 
                            onClick={() => setIsSignin(true)} 
                            className={isSignin ? activeClasses : inactiveClasses}
                        >
                            Sign in
                        </button>
                    </div>

                    <div className="overflow-hidden w-full max-w-md pointer-events-auto">
                        <div id="form-slider" className="flex w-[200%] transition-transform duration-500 ease-in-out" style={{ transform: isSignin ? 'translateX(-50%)' : 'translateX(0)' }}>
                            
                            <form id="signup-form" onSubmit={handleSignup} className="w-1/2 flex flex-col space-y-4 pr-4 pl-1 py-1 animate-fade-in-up">
                                <input id="signup-name" type="text" placeholder="Full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="w-full p-4 bg-gray-800/50 md:bg-gray-300/50 border border-gray-600 md:border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white md:text-black placeholder-gray-400 md:placeholder-gray-500" required />
                                <input id="signup-email" type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="w-full p-4 bg-gray-800/50 md:bg-gray-300/50 border border-gray-600 md:border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white md:text-black placeholder-gray-400 md:placeholder-gray-500" required />
                                <input id="signup-password" type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="w-full p-4 bg-gray-800/50 md:bg-gray-300/50 border border-gray-600 md:border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white md:text-black placeholder-gray-400 md:placeholder-gray-500" required />
                                
                                <label className="flex items-center space-x-3 text-xs text-gray-300 md:text-gray-700">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 md:border-gray-400 bg-gray-800 md:bg-white" required />
                                    <span>I agree that Crypto Students may send me marketing messages.</span>
                                </label>

                                <button type="submit" disabled={isLoading} className={`bg-purple-600 md:bg-[#0a051a] text-white w-fit px-10 py-3 rounded-full font-bold transition-all shadow-lg mx-auto md:mx-0 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 md:hover:bg-purple-900 active:scale-95'}`}>
                                    {isLoading ? 'Processing...' : 'Create account for free'}
                                </button>
                            </form>

                            <form id="signin-form" onSubmit={handleSignin} className="w-1/2 flex flex-col space-y-4 pr-4 pl-1 py-1">
                                <input id="signin-email" type="email" placeholder="Email" value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} className="w-full p-4 bg-gray-800/50 md:bg-gray-300/50 border border-gray-600 md:border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white md:text-black placeholder-gray-400 md:placeholder-gray-500" required />
                                <input id="signin-password" type="password" placeholder="Password" value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} className="w-full p-4 bg-gray-800/50 md:bg-gray-300/50 border border-gray-600 md:border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white md:text-black placeholder-gray-400 md:placeholder-gray-500" required />
                                
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center space-x-3 text-xs text-gray-300 md:text-gray-700">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 md:border-gray-400 bg-gray-800 md:bg-white" />
                                        <span>Remember me</span>
                                    </label>
                                    <Link href="/ForgotPass" className="text-xs text-purple-400 md:text-[#0a051a] font-bold hover:text-purple-300 md:hover:text-purple-700 transition-colors">Forgot password?</Link>
                                </div>

                                <button type="submit" disabled={isLoading} className={`bg-purple-600 md:bg-[#0a051a] text-white w-fit px-10 py-3 rounded-full font-bold transition-all shadow-lg mx-auto md:mx-0 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 md:hover:bg-purple-900 active:scale-95'}`}>
                                    {isLoading ? 'Processing...' : 'Login to account'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
