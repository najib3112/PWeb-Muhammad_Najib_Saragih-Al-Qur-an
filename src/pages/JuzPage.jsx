import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JuzGrid from '../components/juz/JuzGrid';

export default function JuzPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    // Reset search when component mounts
    setSearchTerm('');
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back to Surah Page Link */}
        <div className="mb-6">
          <Link
            to="/surah"
            className="inline-flex items-center text-gray-600 hover:text-primary"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Kembali ke Daftar Surah
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Juz Al-Quran
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Baca Al-Quran berdasarkan pembagian juz. Terdapat 30 juz dalam Al-Quran.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-2xl mx-auto">
          <div className={`flex items-center border ${isSearchFocused ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'} rounded-lg overflow-hidden transition-all duration-200`}>
            <div className="pl-4">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari juz atau surah..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full px-4 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Pass search term to JuzGrid */}
        <JuzGrid searchTerm={searchTerm} />
      </div>
    </div>
  );
}
