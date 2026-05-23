import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-white bg-transparent min-h-screen flex flex-col relative overflow-x-hidden" style={{ fontFamily: "var(--font-poppins)" }}>
      
      {/* UPDATE JALUR BACKGROUND: Sesuaikan dengan nama file gambar lu, kemarin error-nya nyari Background_IMG.png */}
      <div 
        className="relative w-full h-screen bg-cover bg-center" 
        style={{ backgroundImage: "url('/img/Background_IMG.png')" }}
      >
        
        {/* 'animate-hidden' dihapus dari header dan nav */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 md:py-8 gap-4 md:gap-0">
          <nav className="flex flex-col md:flex-row w-full items-center justify-between gap-4 md:gap-0">  
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12 w-full md:w-auto">
              <Link href="/" className="hidden max-md:flex min-[851px]:flex items-center">
                <img 
                  src="/img/icon.png" 
                  alt="Logo" 
                  className="h-24 w-auto object-contain" 
                />
              </Link>

              <Link href="/" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                Home
              </Link>
              <Link href="/about" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                About
              </Link>
              <Link href="/service" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                Service
              </Link>
              <Link href="/contact" className="text-white font-bold text-sm hover:text-purple-300 transition-all tracking-wide">
                Contact
              </Link>
            </div>

            <div className="flex items-center mt-4 md:mt-0">
              <Link href="/signin">
                <button className="px-8 py-2 text-white font-semibold text-sm bg-transparent rounded-full border border-slate-500 text-center transition-all duration-300 ease-in-out hover:bg-transparent hover:border-purple-400 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.7)]">
                  Sign In
                </button>
              </Link>
            </div>

          </nav>
        </header>

        <main className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center">
            
            <h2 className="text-2xl md:text-[28px] font-semibold mb-2 tracking-wide text-white animate-fade-in-up">
              CRYPTO
            </h2>
            
            <h1 className="text-5xl md:text-[62px] font-extrabold mb-8 tracking-wide uppercase text-white animate-fade-in-up delay-100">
              Platform Learning
            </h1>

            <div className="w-[280px] h-2.5 bg-divider rounded-full mb-10 animate-fade-in-up delay-200"></div>

            <p className="max-w-[900px] text-[15px] md:text-[16px] text-gray-200 font-medium leading-relaxed opacity-100 animate-fade-in-up delay-300">
              Pelajari keajaiban teknologi desentralisasi yang mengubah dunia finansial. Kursus intensif kami membantu Anda menavigasi pasar crypto dengan percaya diri dan pengetahuan yang tepat
            </p>
            
          </div>
        </main>

      </div>
    </div>
  );
}