import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quranAPI } from '../components/quranAPI';

export default function JuzPage() {
  const [juzs, setJuzs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJuzs();
  }, []);

  const fetchJuzs = async () => {
    try {
      setLoading(true);
      const data = await quranAPI.getAllJuzs();
      setJuzs(data);
    } catch (err) {
      setError('Gagal memuat data juz. Silakan coba lagi nanti.');
      console.error('Error fetching juzs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
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
            onClick={fetchJuzs}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Juz Al-Quran
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Baca Al-Quran berdasarkan pembagian juz. Terdapat 30 juz dalam Al-Quran.
          </p>
        </div>

        {/* Juz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {juzs.map((juz) => (
            <div
              key={juz.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {juz.juz_number}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Juz {juz.juz_number}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {juz.verses_count} Ayat
                  </p>
                  <div className="text-sm text-gray-600">
                    <p>Dimulai dari: {juz.first_verse_id}</p>
                    <p>Berakhir di: {juz.last_verse_id}</p>
                  </div>
                  <Link
                    to={`/juz/${juz.juz_number}`}
                    className="inline-block mt-4 text-primary hover:text-primary/80 font-medium"
                  >
                    Baca Juz →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
