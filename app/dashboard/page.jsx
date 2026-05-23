/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isSidebarShrunk, setIsSidebarShrunk] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(true);
    const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'authorized', 'unauthorized', 'admin'
    const [materiData, setMateriData] = useState([]);
    const [userName, setUserName] = useState('User');
    const [userRole, setUserRole] = useState('user');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('userSession');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.replace('/signin');
    };

    useEffect(() => {
        setTimeout(() => setIsClient(true), 0);
        const session = localStorage.getItem('userSession');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName') || 'User';

        setUserName(name);
        setUserRole(role || 'user');

        if (!session) {
            setAuthStatus('unauthorized');
        } else if (role === 'admin') {
            window.location.replace('/admin');
            return;
        } else {
            setAuthStatus('authorized');
            loadMateri();
        }

        async function loadMateri() {
            try {
                if (session) {
                    try {
                        const parsedSession = JSON.parse(session);
                        await supabase.auth.setSession({
                            access_token: parsedSession.access_token,
                            refresh_token: parsedSession.refresh_token
                        });
                    } catch (e) {
                        console.error('Session restore failed', e);
                    }
                }
                const { data, error } = await supabase.from('contents').select('*').order('id', { ascending: false });
                if (!error && data) {
                    const colors = ["bg-blue-950", "bg-violet-700", "bg-emerald-600", "bg-red-900", "bg-amber-500"];
                    const formattedData = data.map((item, index) => ({
                        id: item.id,
                        judul: item.judul || "-",
                        modul: item.modul || "-",
                        desc: item.deskripsi || "-",
                        color: colors[index % colors.length],
                        link: item.file_url || "#"
                    }));
                    setMateriData(formattedData);
                }
            } catch (err) {
                console.error("Failed to fetch materi", err);
            }
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        const initialQ = searchParams.get('search') || '';
        setSearchQuery(initialQ);

        const timeoutId = setTimeout(() => setIsSearchLoading(false), 600);
        return () => clearTimeout(timeoutId);
    }, [searchParams]);

    const handleThemeToggle = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        if (newTheme) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        setIsSearchLoading(true);
        
        if (val) {
            router.replace(`/dashboard?search=${val}`);
        } else {
            router.replace('/dashboard');
        }

        setTimeout(() => setIsSearchLoading(false), 600);
    };

    if (!isClient || authStatus === 'loading') return null;

    if (authStatus === 'unauthorized') {
        return (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a051a', color:'white', fontFamily:'sans-serif'}}>
                <h2 style={{fontSize: '24px', marginBottom: '10px'}}>Silahkan Login</h2>
                <p style={{color: '#ccc'}}>Kamu harus login terlebih dahulu untuk mengakses halaman ini.</p>
                <button onClick={() => window.location.href='/signin'} style={{marginTop:'20px', padding:'10px 20px', cursor:'pointer', background:'#fff', color:'#0a051a', borderRadius:'5px', border:'none', fontWeight:'bold'}}>Ke Halaman Login</button>
            </div>
        );
    }

    if (authStatus === 'admin') {
        return null; // Will redirect via window.location.replace
    }

    const filteredData = materiData.filter(item => item.judul.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
                @keyframes bounceIn {
                    0% { opacity: 0; transform: scale(0.5) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}} />
            
            <div className={`sidebar-container ${isSidebarShrunk ? 'shrink' : ''}`} id="sidebar">
                <button className="sidebar-viewButton" onClick={() => setIsSidebarShrunk(!isSidebarShrunk)} type="button" title="Shrink/Expand">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                <div className="sidebar-wrapper">
                    <div className="sidebar-themeContainer">
                        <label htmlFor="theme-toggle" className={`sidebar-themeLabel ${isDarkMode ? 'switched' : ''}`} onClick={(e) => { e.preventDefault(); handleThemeToggle(); }}>
                            <input className="sidebar-themeInput" type="checkbox" id="theme-toggle" checked={isDarkMode} readOnly />

                            <div className="sidebar-themeType light">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="sidebar-listIcon">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                                <span className="sidebar-themeInputText">Light</span>
                            </div>

                            <div className="sidebar-themeType dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="sidebar-listIcon">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                                <span className="sidebar-themeInputText">Dark</span>
                            </div>
                        </label>
                    </div>

                    <ul className="sidebar-list">
                        <li className="sidebar-listItem active">
                            <Link href="/dashboard">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar-listIcon">
                                    <rect x="3" y="3" rx="2" ry="2" />
                                    <path d="M3 9h18M9 21V9" />
                                </svg>
                                <span className="sidebar-listItemText">Dashboard</span>
                            </Link>
                        </li>
                    </ul>

                    <div style={{ position: 'relative', marginTop: 'auto' }}>
                        {isProfileOpen && (
                            <div style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '0',
                                width: 'max-content',
                                minWidth: '120px',
                                marginBottom: '15px',
                                backgroundColor: 'var(--panel-color)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '10px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transformOrigin: 'bottom left',
                                animation: 'bounceIn 300ms cubic-bezier(.59, -.18, .38, 1.32) forwards'
                            }}>
                                <button 
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                                >
                                    Logout
                                </button>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: '20px',
                                    width: '0',
                                    height: '0',
                                    borderLeft: '8px solid transparent',
                                    borderRight: '8px solid transparent',
                                    borderTop: '8px solid var(--panel-color)'
                                }}></div>
                            </div>
                        )}
                        <div className="sidebar-profileSection" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ marginTop: '0' }}>
                            <img src="https://assets.codepen.io/3306515/i-know.jpg" alt="Profile" />
                            <span>{userName}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="main-content" style={{ flex: 1, padding: '20px md:40px', overflowY: 'auto' }}>
                <h2 style={{ color: 'inherit', fontSize: '28px', margin: '0 0 30px 0' }}>Kelas Saya</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div className="search-container" style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center' }}>
                        <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Cari materi..."
                            style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--panel-color)', color: 'var(--text-color)' }} />
                    </div>
                </div>

                <div className="card-grid">
                    {isSearchLoading ? (
                        <>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="card" style={{ opacity: 0.7, pointerEvents: 'none' }}>
                                    <div className="card-header" style={{ background: 'var(--border-color)', height: '120px', animation: 'pulse 1.5s infinite' }}></div>
                                    <div className="card-body" style={{ padding: '20px' }}>
                                        <div style={{ height: '20px', width: '100%', background: 'var(--border-color)', marginBottom: '10px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                        <div style={{ height: '20px', width: '80%', background: 'var(--border-color)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {filteredData.length === 0 ? (
                                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-color)' }}>Pencarian tidak ditemukan bro.</p>
                            ) : (
                                filteredData.map((item) => (
                                    <div key={item.id} className="card" style={{ position: 'relative' }}>
                                        <Link href={`/materi/${item.id}`} style={{ cursor: 'pointer', height: '100%', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                            <div className={`card-header ${item.color}`}>
                                                <h3>{item.judul}</h3>
                                                <p>{item.modul}</p>
                                            </div>
                                            <div className="card-body">
                                                <p className="description">{item.desc}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div style={{display:'flex', height:'100vh', justifyContent:'center', alignItems:'center', background:'#0a051a', color:'white'}}>Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
