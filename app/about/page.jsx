import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#0a051a] md:bg-[#d1d5db]">
      
      {/* Full-width Header */}
      <header className="absolute top-0 left-0 w-full z-50 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 md:py-8 animate-fade-in-down">
        <nav className="flex flex-col md:flex-row w-full items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/" className="hidden md:flex">
              <img src="/img/icon.png" alt="Logo" className="h-24 md:h-32 w-auto" />
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                Home
              </Link>
              <Link href="/about" className="text-purple-400 border-b-2 border-purple-400 font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                About
              </Link>
              <Link href="/service" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                Service
              </Link>
              <Link href="/contact" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
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
        
        {/* Efek Pendaran Cahaya Ungu di Kiri Bawah */}
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 blur-[120px] rounded-full z-0"></div>
      </div>

      {/* SISI KANAN: Konten Deskripsi (Scrollable) */}
      <div className="relative md:absolute md:right-0 w-full md:w-[50%] h-full flex flex-col pt-32 md:pt-40 pb-20 px-6 md:px-12 xl:pl-[12%] xl:pr-[7%] z-0 overflow-y-auto animate-fade-in-up bg-[#0a051a] md:bg-transparent">
        
        <div className="md:hidden flex flex-col items-center justify-center mb-10 gap-4">
            <Link href="/">
                <img src="/img/icon.png" alt="Logo" className="h-24 w-auto" />
            </Link>
            <Link href="/signin">
                <button className="px-8 py-2 text-white font-semibold text-sm bg-transparent rounded-full border border-gray-400 text-center transition-all duration-300 ease-in-out hover:bg-transparent hover:border-purple-400 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] hover:text-purple-400">
                    Sign In
                </button>
            </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white md:text-[#0a051a] mb-8 text-center md:text-left tracking-tight">About Crypto Student</h1>
        
        <div className="space-y-8 text-gray-300 md:text-gray-700">
          <p className="text-lg md:text-xl font-medium leading-relaxed">
            Crypto Student adalah platform pembelajaran crypto yang membantu pengguna belajar mulai dari dasar hingga tingkat menengah. Kami menyediakan materi yang mudah dipahami, pembelajaran trading dan blockchain, serta panduan memahami dunia cryptocurrency dengan lebih terarah dan praktis.
          </p>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white md:text-black mb-3">Our Vision & Mission</h2>
            <p className="text-base md:text-lg bg-gray-800/50 md:bg-gray-300/50 p-6 rounded-2xl border border-gray-600 md:border-gray-400 leading-relaxed shadow-sm">
              Visi dan misi kami adalah menjadi platform edukasi crypto terpercaya yang membantu semua kalangan memahami cryptocurrency dengan lebih mudah. Kami ingin membangun komunitas belajar yang aktif, menyediakan materi berkualitas, serta membantu member berkembang menjadi lebih percaya diri dalam dunia crypto.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white md:text-black mb-3">Why Join Us?</h2>
            <ul className="list-disc list-inside text-base md:text-lg space-y-3 leading-relaxed">
              <li>Materi pembelajaran disusun bertahap dari level beginner hingga professional.</li>
              <li>Mendapatkan update materi untuk memahami arah market.</li>
              <li>Komunitas aktif untuk diskusi, sharing pengalaman, dan mentoring bersama.</li>
              <li>Belajar dengan penjelasan yang mudah dipahami serta cocok untuk semua kalangan.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}