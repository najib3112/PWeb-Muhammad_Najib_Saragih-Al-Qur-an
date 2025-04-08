import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative bg-primary py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '30px 30px'
             }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-arabic">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </p>
          <p className="text-lg text-white/80 mb-12 leading-relaxed">
            Baca, pelajari, dan dengarkan Al-Quran kapan saja dan di mana saja. 
            Tersedia terjemahan dan tafsir untuk membantu pemahaman yang lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/surah"
              className="btn bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Mulai Membaca
            </Link>
            <a
              href="#features"
              className="btn bg-white/10 text-white hover:bg-white/20 font-semibold text-lg px-8 py-3 rounded-lg border-2 border-white/30 transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </div>

      {/* Wave Shape Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="fill-current text-gray-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
        >
          <path
            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}