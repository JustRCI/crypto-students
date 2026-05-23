"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import { showAlert } from '@/utils/alert';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showAlert("Mohon lengkapi seluruh kolom yang tersedia.", "warning");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const { error } = await supabase.from('feedbacks').insert([
        { 
          name: formData.name, 
          email: formData.email, 
          message: formData.message 
        }
      ]);
      
      if (error) throw error;
      
      setSubmitStatus("success");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#0a051a] md:bg-[#d1d5db]">
      
      {/* Full-width Header */}
      <header className="absolute top-0 left-0 w-full z-50 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-3 md:py-4 animate-fade-in-down backdrop-blur-md bg-white/5 border-b border-white/10 shadow-sm">
        <nav className="flex flex-col md:flex-row w-full items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/" className="hidden md:flex">
              <img src="/img/icon.png" alt="Logo" className="h-12 md:h-16 w-auto" />
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                Home
              </Link>
              <Link href="/about" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                About
              </Link>
              <Link href="/service" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                Service
              </Link>
              <Link href="/contact" className="text-purple-400 border-b-2 border-purple-400 font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <Link href="/signin">
              <button className="px-8 py-2 text-white md:text-black font-semibold text-sm bg-transparent rounded-full border border-gray-400 md:border-gray-600 text-center transition-all duration-300 ease-in-out hover:bg-transparent hover:border-purple-400 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] hover:text-purple-400 md:hover:text-purple-600">
                Sign In
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* SISI KIRI: Efek Clip Path Gelap */}
      <div 
        className="hidden md:flex relative w-[60%] bg-[#0a051a] flex-col p-12 z-10 animate-fade-in-left" 
        style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 0% 100%)" }}
      >
        
        {/* Pendaran Cahaya Ungu Kiri Bawah */}
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 blur-[120px] rounded-full z-0"></div>
      </div>

      {/* SISI KANAN: Form Contact (Get in Touch) */}
      <div className="relative md:absolute md:right-0 w-full md:w-[50%] h-full flex flex-col pt-32 md:pt-40 pb-20 px-6 md:px-12 xl:pl-[12%] xl:pr-[7%] z-0 overflow-y-auto animate-fade-in-up bg-[#0a051a] md:bg-transparent">
        
        <div className="md:hidden flex flex-col items-center justify-center mb-10 gap-4">
            <Link href="/">
                <img src="/img/icon.png" alt="Logo" className="h-12 w-auto" />
            </Link>
            <Link href="/signin">
                <button className="px-8 py-2 text-white font-semibold text-sm bg-transparent rounded-full border border-gray-400 text-center transition-all duration-300 ease-in-out hover:bg-transparent hover:border-purple-400 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] hover:text-purple-400">
                    Sign In
                </button>
            </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white md:text-[#0a051a] mb-6 md:mb-8 text-center md:text-left tracking-tight">Get in Touch</h1>
        <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-400 md:text-gray-600 mb-10 text-center md:text-left">Punya pertanyaan seputar kelas, komunitas, atau pembelajaran crypto? Jangan ragu untuk menghubungi tim kami, kami siap membantu perjalanan belajar crypto Anda.</p>
        
        <form className="w-full max-w-xl mx-auto md:mx-0 flex flex-col space-y-6" onSubmit={handleSubmit}>
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-500/20 border border-green-500 text-green-500 md:text-green-700 md:border-green-700 rounded-xl text-base md:text-lg font-medium">
              Yeay! Pesan kamu berhasil dikirim.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-500/20 border border-red-500 text-red-500 md:text-red-700 md:border-red-700 rounded-xl text-base md:text-lg font-medium">
              Waduh, pesan gagal dikirim. Coba lagi ya!
            </div>
          )}
          <input 
            type="text" 
            placeholder="Your Name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-4 md:p-5 text-base md:text-lg bg-gray-800/50 md:bg-gray-300/50 border border-gray-600 md:border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white md:text-black placeholder-gray-400 md:placeholder-gray-500 shadow-sm" 
          />
          <input 
            type="email" 
            placeholder="Your Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-4 md:p-5 text-base md:text-lg bg-gray-800/50 md:bg-gray-300/50 border border-gray-600 md:border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white md:text-black placeholder-gray-400 md:placeholder-gray-500 shadow-sm" 
          />
          <textarea 
            placeholder="How can we help you?" 
            rows="5" 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full p-4 md:p-5 text-base md:text-lg bg-gray-800/50 md:bg-gray-300/50 border border-gray-600 md:border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none text-white md:text-black placeholder-gray-400 md:placeholder-gray-500 shadow-sm"
          ></textarea>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`text-white text-base md:text-lg w-fit px-12 py-4 mt-4 rounded-full font-bold transition-all duration-300 active:scale-95 shadow-xl mx-auto md:mx-0 ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 md:bg-[#0a051a] hover:bg-purple-500 md:hover:bg-purple-900 hover:-translate-y-1'}`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>


        </form>
      </div>

    </div>
  );
}