'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { showAlert } from '@/utils/alert';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function MateriPage({ params }) {
    const router = useRouter();
    // Unwrap params to avoid Next.js warnings on async route params
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [isClient, setIsClient] = useState(false);
    const [materi, setMateri] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
        
        const sessionStr = localStorage.getItem('userSession');
        if (!sessionStr) {
            router.push('/signin');
            return;
        }

        async function fetchMateri() {
            try {
                const session = JSON.parse(sessionStr);
                await supabase.auth.setSession({
                    access_token: session.access_token,
                    refresh_token: session.refresh_token
                });

                const { data, error } = await supabase
                    .from('contents')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    throw new Error("Materi tidak ditemukan");
                }
                
                setMateri(data);
            } catch (err) {
                console.error("Error fetching materi:", err);
                showAlert("Materi tidak ditemukan atau Anda tidak memiliki izin akses.", "danger");
                setTimeout(() => router.push('/dashboard'), 2000);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMateri();
    }, [id, router]);

    if (!isClient || isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0b0e14', color: 'white' }}>
                <p>Memuat materi...</p>
            </div>
        );
    }

    if (!materi) return null;

    return (
        <div style={{
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: "#0b0e14",
            backgroundImage: "radial-gradient(circle at top right, #1a1b3a, #0b0e14)",
            minHeight: "100vh",
            color: "#e0e0e0",
            padding: "40px 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start"
        }}>
            <div style={{
                maxWidth: "1000px",
                width: "100%",
                background: "rgba(23, 25, 35, 0.8)",
                padding: "40px",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)"
            }}>
                <div style={{ marginBottom: "20px" }}>
                    <Link href="/dashboard" style={{
                        color: "#a78bfa",
                        textDecoration: "none",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "14px"
                    }}>
                        ← Kembali ke Dashboard
                    </Link>
                </div>

                <header style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h2 style={{
                        background: "linear-gradient(to right, #a78bfa, #60a5fa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "2.5em",
                        marginBottom: "10px",
                        fontWeight: "700"
                    }}>
                        {materi.judul}
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: "1.1em", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
                        {materi.deskripsi || "Silakan pelajari materi di bawah ini atau unduh untuk akses offline."}
                    </p>
                    <p style={{ marginTop: "10px", fontSize: "0.9em", color: "#64748b" }}>
                        Instruktur: <strong>{materi.instruktur || "-"}</strong>
                    </p>
                </header>

                <div style={{
                    border: "1px solid rgba(167, 139, 250, 0.3)",
                    borderRadius: "15px",
                    overflow: "hidden",
                    background: "#1e1e1e",
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.1)",
                    position: "relative"
                }}>
                    <iframe 
                        src={`${materi.file_url}#toolbar=0&navpanes=0&scrollbar=0`} 
                        style={{
                            border: "none",
                            display: "block",
                            width: "100%",
                            height: "70vh",
                            minHeight: "600px",
                            filter: "brightness(0.9)"
                        }}
                    ></iframe>
                </div>

                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <a href={materi.file_url} target="_blank" rel="noopener noreferrer" style={{
                        display: "inline-block",
                        background: "linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)",
                        color: "white",
                        padding: "14px 30px",
                        textDecoration: "none",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                        boxShadow: "0 4px 15px rgba(79, 70, 229, 0.4)",
                        transition: "all 0.3s ease",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                        <span>📥</span> Download Materi ({materi.file_url?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Dokumen'})
                    </a>
                </div>
            </div>
        </div>
    );
}
