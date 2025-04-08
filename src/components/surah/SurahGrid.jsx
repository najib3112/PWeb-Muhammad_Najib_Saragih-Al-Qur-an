import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { quranAPI } from '../quranAPI';
import SurahCard from './SurahCard';

export default function SurahGrid() {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurahs();
  }, []);

  useEffect(() => {
    filterSurahs();
  }, [searchQuery, surahs]);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const data = await quranAPI.getAllSurahs();
      setSurahs(data);
      setFilteredSurahs(data);
    } catch (err) {
      setError('Gagal memuat data surah. Silakan coba lagi nanti.');
      console.error('Error fetching surahs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSurahs = () => {
    const query = searchQuery.toLowerCase();
    const filtered = surahs.filter(surah => 
      surah.name_simple.toLowerCase().includes(query) ||
      surah.translated_name.name.toLowerCase().includes(query) ||
      surah.id.toString().includes(query)
    );
    setFilteredSurahs(filtered);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
          {error}
          <button
            onClick={fetchSurahs}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari surah berdasarkan nama atau nomor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurahs.map(surah => (
          <SurahCard
            key={surah.id}
            surah={surah}
            onClick={() => {
              // Handle surah selection
              console.log('Selected surah:', surah);
            }}
          />
        ))}
      </div>

      {/* No Results Message */}
      {filteredSurahs.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          Tidak ada surah yang sesuai dengan pencarian Anda.
        </div>
      )}
    </div>
  );
}