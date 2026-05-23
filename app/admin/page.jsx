'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { showAlert } from '@/utils/alert';
import Chart from 'chart.js/auto';
import './admin.css';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminPage() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarClose, setIsSidebarClose] = useState(false);
    const [dataMateri, setDataMateri] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Feedback states
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [replyText, setReplyText] = useState('');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ judul: '', modul: '', instruktur: '', deskripsi: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Chart refs
    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);

    useEffect(() => {
        // Restore session from localStorage to ensure RLS is bypassed correctly
        const sessionStr = localStorage.getItem('userSession');
        if (!sessionStr) {
            // User not logged in, redirect to signin
            router.push('/signin');
            return;
        }

        const session = JSON.parse(sessionStr);
        supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token
        });

        // Verifikasi ketat: pastikan role benar-benar admin di database Supabase
        async function verifyAdmin() {
            if (!session.user?.id) {
                router.push('/signin');
                return;
            }
            const { data, error } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            if (error || data?.role !== 'admin') {
                showAlert('Akses Ditolak. Anda tidak memiliki izin sebagai Administrator.', 'danger');
                setTimeout(() => window.location.replace('/dashboard'), 2000);
                return;
            }
            // Lanjut ke load data jika admin valid
            loadMateri();
            loadFeedbacks();
            initCharts();
        }
        
        verifyAdmin();

        const mode = localStorage.getItem('mode');
        if (mode === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark');
        }
        const status = localStorage.getItem('status');
        if (status === 'close') setIsSidebarClose(true);

        return () => {
            if (lineChartRef.current) lineChartRef.current.destroy();
            if (barChartRef.current) barChartRef.current.destroy();
        };
    }, [router]);

    const initCharts = () => {
        const ctxLine = document.getElementById('lineChart');
        const ctxBar = document.getElementById('barChart');
        if (ctxLine && !lineChartRef.current) {
            lineChartRef.current = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{ label: 'Pengunjung', data: [12, 19, 3, 5, 2, 3], borderColor: '#0E4BF1', tension: 0.1 }]
                }
            });
        }
        if (ctxBar && !barChartRef.current) {
            barChartRef.current = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['Modul 1', 'Modul 2', 'Modul 3', 'Modul 4'],
                    datasets: [{ label: 'Views', data: [65, 59, 80, 81], backgroundColor: '#4DA3FF' }]
                }
            });
        }
    };

    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('mode', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('mode', 'light');
        }
    };

    const toggleSidebar = () => {
        setIsSidebarClose(!isSidebarClose);
        localStorage.setItem('status', !isSidebarClose ? 'close' : 'open');
    };

    const loadMateri = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('contents').select('*').order('id', { ascending: false });
        if (!error && data) {
            setDataMateri(data);
        }
        setIsLoading(false);
    };

    const loadFeedbacks = async () => {
        const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
        if (!error && data) {
            setFeedbacks(data);
            if (data.length > 0 && !selectedFeedback) {
                setSelectedFeedback(data[0]);
            }
        }
    };

    const sendReply = async (id) => {
        if (!replyText) return;
        try {
            const { error } = await supabase.from('feedbacks').update({ reply: replyText, status: 'replied' }).eq('id', id);
            if (error) throw error;
            showAlert('Balasan telah berhasil disimpan.', 'success');
            setReplyText('');
            loadFeedbacks();
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('userSession');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.replace('/signin');
    };

    const openModal = (item = null) => {
        if (item) {
            setEditData(item);
            setFormData({ judul: item.judul || '', modul: item.modul || '', instruktur: item.instruktur || '', deskripsi: item.deskripsi || '' });
        } else {
            setEditData(null);
            setFormData({ judul: '', modul: '', instruktur: '', deskripsi: '' });
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditData(null);
    };

    const saveMateri = async () => {
        if (!formData.judul || !formData.modul || !formData.instruktur || !formData.deskripsi) {
            showAlert('Mohon lengkapi semua kolom formulir yang tersedia.', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            let fileUrl = editData ? editData.file_url : '';

            if (selectedFile) {
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (!allowedTypes.includes(selectedFile.type)) {
                    showAlert('Format berkas tidak valid. Harap unggah berkas berformat PDF, DOC, atau DOCX.', 'warning');
                    setIsSaving(false);
                    return;
                }
                if (selectedFile.size > 10 * 1024 * 1024) {
                    showAlert('Ukuran berkas melebihi batas maksimal 10MB.', 'warning');
                    setIsSaving(false);
                    return;
                }

                const fileName = `${Date.now()}-${selectedFile.name}`;
                const { error: uploadError } = await supabase.storage.from('modules').upload(fileName, selectedFile);
                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage.from('modules').getPublicUrl(fileName);
                fileUrl = publicUrlData.publicUrl;

                // Cleanup old file if updating
                if (editData && editData.file_url) {
                    const oldFileName = editData.file_url.split('/modules/')[1];
                    if (oldFileName) {
                        await supabase.storage.from('modules').remove([oldFileName]);
                    }
                }
            }

            const updateData = { ...formData, file_url: fileUrl };
            if (!editData) {
                const { error } = await supabase.from('contents').insert([updateData]);
                if (error) throw error;
                showAlert('Materi telah berhasil ditambahkan.', 'success');
            } else {
                const { error } = await supabase.from('contents').update(updateData).eq('id', editData.id);
                if (error) throw error;
                showAlert('Materi telah berhasil diperbarui.', 'success');
            }
            
            closeModal();
            loadMateri();
        } catch (err) {
            showAlert(err.message, 'danger');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteMateri = async (id, fileUrl) => {
        if (!confirm('Yakin ingin menghapus?')) return;

        try {
            // Delete file from storage
            if (fileUrl) {
                const oldFileName = fileUrl.split('/modules/')[1];
                if (oldFileName) {
                    await supabase.storage.from('modules').remove([oldFileName]);
                }
            }

            const { error } = await supabase.from('contents').delete().eq('id', id);
            if (error) throw error;

            showAlert('Materi telah berhasil dihapus.', 'success');
            loadMateri();
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    };

    return (
        <div style={{minHeight: '100vh'}} className={isDarkMode ? 'dark' : ''}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.2.0/css/line.css" />
            <nav className={`admin-nav ${isSidebarClose ? 'close' : ''}`}>
                <div className="logo-name">
                    <div className="logo-image">
                        <img src="/asset/img/Favicon.png" alt="" onError={(e) => e.target.src = '/globe.svg'} />
                    </div>
                    <span className="logo_name">Crypto Students</span>
                </div>
                <div className="menu-items">
                    <ul className="nav-links">
                        <li>
                            <a href="#dashboard-section">
                                <i className="uil uil-estate"></i>
                                <span className="link-name">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#content-section">
                                <i className="uil uil-file-landscape"></i>
                                <span className="link-name">Content</span>
                            </a>
                        </li>
                        <li>
                            <a href="#analytics-section">
                                <i className="uil uil-chart"></i>
                                <span className="link-name">Analytics</span>
                            </a>
                        </li>
                        <li>
                            <a href="#feedback-section">
                                <i className="uil uil-comments"></i>
                                <span className="link-name">Feedback</span>
                            </a>
                        </li>
                    </ul>
                    <ul className="logout-mode">
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                <i className="uil uil-signout"></i>
                                <span className="link-name">Logout</span>
                            </a>
                        </li>
                        <li className="mode" onClick={toggleMode} style={{cursor: 'pointer'}}>
                            <a href="#" onClick={(e) => e.preventDefault()}>
                                <i className="uil uil-moon"></i>
                                <span className="link-name">Dark Mode</span>
                            </a>
                            <div className="mode-toggle">
                                <span className="switch"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>

            <section className="dashboard">
                <div className="top">
                    <i className="uil uil-bars sidebar-toggle" onClick={toggleSidebar}></i>
                    <div className="search-box">
                        <i className="uil uil-search"></i>
                        <input type="text" placeholder="Cari disini..." />
                    </div>
                    <img src="/asset/img/profile.png" alt="" onError={(e) => e.target.src = '/globe.svg'} />
                </div>

                <div className="dash-content">
                    <section id="dashboard-section" className="main-section">
                        <div className="overview">
                            <div className="title">
                                <i className="uil uil-tachometer-fast-alt"></i>
                                <span className="text">Dashboard Overview</span>
                            </div>
                            <div className="boxes">
                                <div className="box box1">
                                    <i className="uil uil-eye"></i>
                                    <span className="text">Total Views</span>
                                    <span className="number">1,240</span>
                                </div>
                                <div className="box box2">
                                    <i className="uil uil-files-landscapes"></i>
                                    <span className="text">Total Materi</span>
                                    <span className="number" id="stat-materi">{dataMateri.length}</span>
                                </div>
                                <div className="box box3">
                                    <i className="uil uil-comments"></i>
                                    <span className="text">Feedback Baru</span>
                                    <span className="number">3</span>
                                </div>
                            </div>
                        </div>

                        <div className="content-management" id="content-section">
                            <div className="title">
                                <i className="uil uil-file-landscape"></i>
                                <span className="text">Manajemen Materi</span>
                            </div>
                            <div className="action-bar">
                                <button className="add-btn" onClick={() => openModal()}>
                                    <i className="uil uil-plus"></i> Tambah Materi
                                </button>
                            </div>
                            <div className="materi-container" id="materiList">
                                {isLoading ? (
                                    <>
                                        <style dangerouslySetInnerHTML={{__html: `
                                            @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
                                        `}} />
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="materi-card" style={{ opacity: 0.7, pointerEvents: 'none' }}>
                                                <div className="card-header-color" style={{ background: 'var(--border-color)', animation: 'pulse 1.5s infinite' }}></div>
                                                <div className="card-body">
                                                    <div style={{ height: '20px', width: '60px', background: 'var(--border-color)', marginBottom: '12px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                    <div style={{ height: '14px', width: '120px', background: 'var(--border-color)', marginBottom: '15px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                    <div style={{ height: '13px', width: '100%', background: 'var(--border-color)', marginBottom: '5px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                    <div style={{ height: '13px', width: '80%', background: 'var(--border-color)', marginBottom: '15px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                </div>
                                                <div className="card-actions">
                                                    <div style={{ height: '30px', flex: 1, background: 'var(--border-color)', borderRadius: '6px', animation: 'pulse 1.5s infinite' }}></div>
                                                    <div style={{ height: '30px', flex: 1, background: 'var(--border-color)', borderRadius: '6px', animation: 'pulse 1.5s infinite' }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : dataMateri.length === 0 ? (
                                    <p style={{ textAlign: 'center', padding: '20px', width: '100%' }}>Belum ada materi</p>
                                ) : (
                                    dataMateri.map((item) => (
                                        <div key={item.id} className="materi-card">
                                            <div className="card-header-color">
                                                <h4>{item.judul || '-'}</h4>
                                            </div>
                                            <div className="card-body">
                                                <span className="module-tag">{item.modul || '-'}</span>
                                                <p className="instructor">
                                                    <strong>{item.instruktur || '-'}</strong>
                                                </p>
                                                <p className="desc">{item.deskripsi || '-'}</p>
                                                {item.file_url && (
                                                    <a href={item.file_url} target="_blank" className="download-btn" style={{display: 'inline-block', padding: '8px 12px', background: 'var(--primary-color)', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', marginTop: '10px'}}>
                                                        Download Modul
                                                    </a>
                                                )}
                                            </div>
                                            <div className="card-actions">
                                                <button className="action-btn edit-btn" onClick={() => openModal(item)}>Edit</button>
                                                <button className="action-btn delete-btn" onClick={() => deleteMateri(item.id, item.file_url)}>Hapus</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="analytics-content" id="analytics-section">
                            <div className="title">
                                <i className="uil uil-chart"></i>
                                <span className="text">Statistik Pembelajaran</span>
                            </div>
                            <div className="charts-container">
                                <div className="chart-box">
                                    <h3>Tren Pengunjung</h3>
                                    <canvas id="lineChart"></canvas>
                                </div>
                                <div className="chart-box">
                                    <h3>Materi Terpopuler</h3>
                                    <canvas id="barChart"></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="activity feedback-section" id="feedback-section">
                            <div className="title">
                                <i className="uil uil-comments"></i>
                                <span className="text">Pusat Feedback Mahasiswa</span>
                            </div>
                            <div className="feedback-container" style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                                <div className="message-list" style={{flex: '1 1 300px', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', maxHeight: '500px', overflowY: 'auto'}}>
                                    <div className="inbox-header">Pesan Masuk</div>
                                    {feedbacks.map(fb => (
                                        <div key={fb.id} className={`inbox-item ${selectedFeedback?.id === fb.id ? 'active' : ''}`} onClick={() => setSelectedFeedback(fb)}>
                                            <h4>{fb.name}</h4>
                                            <span>{fb.email}</span>
                                            <p>{fb.message.substring(0, 50)}{fb.message.length > 50 ? '...' : ''}</p>
                                        </div>
                                    ))}
                                    {feedbacks.length === 0 && <p style={{padding: '15px', color: 'var(--text-color)'}}>Belum ada pesan masuk.</p>}
                                </div>
                                <div className="message-detail" style={{flex: '2 1 400px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column'}}>
                                    {selectedFeedback ? (
                                        <>
                                            <div id="detailContent" style={{marginBottom: '20px', minHeight: '150px', display: 'flex', flexDirection: 'column', flex: 1}}>
                                                <div className="bubble mahasiswa">
                                                    <strong>{selectedFeedback.name}: </strong><br/>
                                                    {selectedFeedback.message}
                                                </div>
                                                {selectedFeedback.reply && (
                                                    <div className="bubble admin">
                                                        <strong>Admin Reply: </strong><br/>
                                                        {selectedFeedback.reply}
                                                    </div>
                                                )}
                                            </div>
                                            <div id="replyArea">
                                                <textarea 
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '10px', background: 'var(--panel-color)', color: 'var(--text-color)'}} 
                                                    placeholder="Tulis jawaban atau catatan admin..."
                                                ></textarea>
                                                <button className="add-btn" onClick={() => sendReply(selectedFeedback.id)}>Simpan Balasan</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--black-light-color)'}}>
                                            <p>Pilih pesan di sebelah kiri untuk melihat detail.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </section>

            {isModalOpen && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <h3>{editData ? 'Edit Materi' : 'Tambah Materi'}</h3>
                        <input type="text" placeholder="Judul Materi" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} />
                        <input type="text" placeholder="Modul" value={formData.modul} onChange={(e) => setFormData({...formData, modul: e.target.value})} />
                        <input type="text" placeholder="Nama Pengunggah" value={formData.instruktur} onChange={(e) => setFormData({...formData, instruktur: e.target.value})} />
                        <textarea placeholder="Deskripsi Materi" rows="3" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}></textarea>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        {editData && editData.file_url && <p style={{fontSize: '12px', color: 'var(--black-light-color)', marginBottom: '10px'}}>Current File: {editData.file_url.split('/').pop()}</p>}
                        <div className="modal-buttons">
                            <button className="save-btn" onClick={saveMateri} disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
                            <button className="cancel-btn" onClick={closeModal} disabled={isSaving}>Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
