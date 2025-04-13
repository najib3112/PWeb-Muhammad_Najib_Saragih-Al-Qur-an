import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quranAPI } from '../components/quranAPI';

export default function JuzDetailPage() {
  const { juzNumber } = useParams();
  const [juzData, setJuzData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchJuzDetails(currentPage);
  }, [juzNumber, currentPage]);

  const fetchJuzDetails = async (page) => {
    try {
      setLoading(true);
      const data = await quranAPI.getJuzDetails(juzNumber, page);
      setJuzData(data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Gagal memuat detail juz. Silakan coba lagi nanti.');
      console.error('Error fetching juz details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.total_pages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  if (loading && !juzData) {
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
            onClick={() => fetchJuzDetails(currentPage)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!juzData) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/surah"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Daftar Surah
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Juz {juzNumber}
          </h1>
          <p className="text-gray-600 mb-4">
            {pagination?.total_records} Ayat
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      )}

      {/* Verses */}
      <div className="space-y-8">
        {juzData.verses.map((verse) => {
          const [surahNumber, verseNumber] = verse.verse_key.split(':');

          return (
            <div
              key={verse.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              {/* Verse Number */}
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-lg">
                  {verseNumber}
                </div>
                <div className="text-sm text-gray-600">
                  Surah {surahNumber}:{verseNumber}
                </div>
              </div>

              {/* Arabic Text */}
              <div className="text-right mb-4">
                <p className="font-arabic text-3xl leading-loose text-gray-900">
                  {verse.text_uthmani}
                </p>
              </div>

              {/* Translation */}
              <div className="border-t pt-4">
                <p className="text-gray-600 leading-relaxed">
                  {verse.translations?.[0]?.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary hover:bg-primary/10'
            }`}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <span className="text-gray-600">
            Halaman {currentPage} dari {pagination.total_pages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.total_pages}
            className={`p-2 rounded-lg ${
              currentPage === pagination.total_pages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary hover:bg-primary/10'
            }`}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
