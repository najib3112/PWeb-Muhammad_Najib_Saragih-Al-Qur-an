import { useEffect, useState } from 'react';
import { quranAPI } from '../quranAPI';
import SurahCard from './SurahCard';

export default function SurahGrid({ searchTerm = '' }) {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurahs();
  }, []);

  // If searchTerm is provided from parent, use it
  useEffect(() => {
    if (searchTerm !== '') {
      setSearchQuery(searchTerm);
    }
  }, [searchTerm]);

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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
        {error}
        <button
          onClick={fetchSurahs}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
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
