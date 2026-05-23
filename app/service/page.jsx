import Link from "next/link";

export default function ServicePage() {
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
              <Link href="/service" className="text-purple-400 border-b-2 border-purple-400 font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
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

      {/* SISI KANAN: Daftar Layanan (Our Services) */}
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

        <h1 className="text-4xl md:text-5xl font-extrabold text-white md:text-[#0a051a] mb-8 text-center md:text-left tracking-tight">Our Services</h1>
        
        <div className="flex flex-col space-y-6 w-full mx-auto md:mx-0">
          
          {/* Card Service 1 */}
          <div className="bg-gray-800/50 md:bg-gray-300/50 p-6 rounded-2xl border border-gray-600 md:border-gray-400 hover:bg-purple-600 md:hover:bg-[#0a051a] hover:border-purple-500 hover:text-white transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white md:text-black group-hover:text-white">📚 Crypto Crash Course</h3>
            <p className="text-base md:text-lg text-gray-400 md:text-gray-600 group-hover:text-gray-200 md:group-hover:text-gray-300 leading-relaxed">
              Pelajari dasar-dasar cryptocurrency, blockchain, dan trading melalui kelas intensif yang dirancang khusus untuk pemula hingga tingkat lanjut.
            </p>
          </div>

          {/* Card Service 2 */}
          <div className="bg-gray-800/50 md:bg-gray-300/50 p-6 rounded-2xl border border-gray-600 md:border-gray-400 hover:bg-purple-600 md:hover:bg-[#0a051a] hover:border-purple-500 hover:text-white transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white md:text-black group-hover:text-white">💬 Premium Community</h3>
            <p className="text-base md:text-lg text-gray-400 md:text-gray-600 group-hover:text-gray-200 md:group-hover:text-gray-300 leading-relaxed">
              Bergabung dengan komunitas eksklusif untuk berdiskusi, berbagi strategi, dan mendapatkan dukungan belajar bersama member lainnya.
            </p>
          </div>

          {/* Card Service 3 */}
          <div className="bg-gray-800/50 md:bg-gray-300/50 p-6 rounded-2xl border border-gray-600 md:border-gray-400 hover:bg-purple-600 md:hover:bg-[#0a051a] hover:border-purple-500 hover:text-white transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white md:text-black group-hover:text-white">📈 Daily Market Signal</h3>
            <p className="text-base md:text-lg text-gray-400 md:text-gray-600 group-hover:text-gray-200 md:group-hover:text-gray-300 leading-relaxed">
              Dapatkan update market, analisis crypto, serta signal harian untuk membantu memahami pergerakan pasar dengan lebih baik.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}