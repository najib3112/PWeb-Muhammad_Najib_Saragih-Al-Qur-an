import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, DocumentDuplicateIcon, ShareIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
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
  const [groupedAyat, setGroupedAyat] = useState({});
  const [translations, setTranslations] = useState({});
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [surahNames, setSurahNames] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [copySuccess, setCopySuccess] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all surahs to get their names
      const allSurahs = await quranAPI.getAllSurahs();
      const surahNamesMap = {};
      allSurahs.forEach(surah => {
        surahNamesMap[surah.id] = {
          name: surah.name_simple,
          name_arabic: surah.name_arabic,
          translation: surah.translated_name.name
        };
      });
      setSurahNames(surahNamesMap);
      
      // Fetch juz details
      const data = await quranAPI.getJuzDetails(juzNumber, currentPage);
      setJuzData(data);
      setPagination(data.pagination);
      
      // Group verses by surah
      const grouped = {};
      data.verses.forEach(verse => {
        const surahId = verse.verse_key.split(':')[0];
        if (!grouped[surahId]) {
          grouped[surahId] = [];
        }
        grouped[surahId].push(verse);
      });
      setGroupedAyat(grouped);

      // Load bookmarks
      const savedBookmarks = quranAPI.getBookmarks();
      setBookmarks(savedBookmarks);
    } catch (err) {
      setError('Gagal memuat detail juz. Silakan coba lagi nanti.');
      console.error('Error fetching juz details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [juzNumber, currentPage]);

  useEffect(() => {
    const fetchTranslations = async () => {
      const transData = {};
      setLoadingTranslation(true);
      try {
        await Promise.all(
          Object.values(groupedAyat)
            .flat()
            .map(async (verse) => {
              const res = await fetch(
                `https://api.quran.com/api/v4/quran/translations/33?verse_key=${verse.verse_key}`
              );
              const data = await res.json();
              if (data.translations?.length) {
                // Remove HTML tags from translation
                let translationText = data.translations[0].text;
                translationText = translationText.replace(/<sup.*?<\/sup>/g, '');
                translationText = translationText.replace(/<.*?>/g, '');
                transData[verse.verse_key] = translationText;
              } else {
                transData[verse.verse_key] = "Terjemahan tidak ditemukan.";
              }
            })
        );
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setTranslations(transData);
        setLoadingTranslation(false);
      }
    };

    if (Object.keys(groupedAyat).length > 0) fetchTranslations();
  }, [groupedAyat]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.total_pages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const toggleBookmark = (verseKey) => {
    const [surahNumber, verseNumber] = verseKey.split(':');
    const surahName = surahNames[surahNumber]?.name || `Surah ${surahNumber}`;
    
    const isBookmarked = bookmarks.some(
      b => b.surahNumber === parseInt(surahNumber) && b.verseNumber === parseInt(verseNumber)
    );
    
    if (isBookmarked) {
      const updatedBookmarks = quranAPI.removeBookmark(parseInt(surahNumber), parseInt(verseNumber));
      setBookmarks(updatedBookmarks);
    } else {
      const updatedBookmarks = quranAPI.addBookmark(parseInt(surahNumber), parseInt(verseNumber), surahName);
      setBookmarks(updatedBookmarks);
    }
  };

  const setLastRead = (verseKey) => {
    const [surahNumber, verseNumber] = verseKey.split(':');
    const surahName = surahNames[surahNumber]?.name || `Surah ${surahNumber}`;
    
    quranAPI.setLastRead(parseInt(surahNumber), parseInt(verseNumber), surahName);
    
    // Show confirmation message
    alert(`Ayat ${verseKey} telah ditandai sebagai terakhir dibaca.`);
  };

  const copyAyat = (verseKey, arabicText, translation) => {
    const textToCopy = `${arabicText}\n\n${translation}\n\n(QS. ${verseKey})`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess(verseKey);
        setTimeout(() => setCopySuccess(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const shareAyat = (verseKey, arabicText, translation) => {
    const textToShare = `${arabicText}\n\n${translation}\n\n(QS. ${verseKey})`;
    
    if (navigator.share) {
      navigator.share({
        title: `Al-Quran - ${verseKey}`,
        text: textToShare,
      })
      .catch(err => {
        console.error('Error sharing: ', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyAyat(verseKey, arabicText, translation);
      alert('Link disalin ke clipboard karena browser Anda tidak mendukung fitur berbagi.');
    }
  };

  const isBookmarked = (verseKey) => {
    const [surahNumber, verseNumber] = verseKey.split(':');
    return bookmarks.some(
      b => b.surahNumber === parseInt(surahNumber) && b.verseNumber === parseInt(verseNumber)
    );
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
            onClick={() => fetchData()}
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
          to="/juz"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Daftar Juz
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
      {(loading || loadingTranslation) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      )}

      {/* Verses grouped by Surah */}
      <div className="space-y-12">
        {Object.entries(groupedAyat).map(([surahId, verses]) => (
          <div key={surahId} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {surahNames[surahId]?.name || `Surah ${surahId}`}
            </h2>
            <h3 className="text-xl font-arabic text-center mb-6">
              {surahNames[surahId]?.name_arabic || ''}
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {surahNames[surahId]?.translation || ''}
            </p>
            
            <div className="space-y-8">
              {verses.map((verse) => {
                const verseKey = verse.verse_key;
                const [, verseNumber] = verseKey.split(':');
                const bookmarked = isBookmarked(verseKey);
                
                return (
                  <div
                    key={verse.id}
                    className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                  >
                    {/* Verse Number and Actions */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-lg">
                        {verseNumber}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => toggleBookmark(verseKey)}
                          className="text-gray-500 hover:text-primary"
                          title={bookmarked ? "Hapus bookmark" : "Tambahkan bookmark"}
                        >
                          {bookmarked ? (
                            <BookmarkSolidIcon className="h-5 w-5 text-primary" />
                          ) : (
                            <BookmarkIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button 
                          onClick={() => setLastRead(verseKey)}
                          className="text-gray-500 hover:text-primary"
                          title="Tandai sebagai terakhir dibaca"
                        >
                          <ClockIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => copyAyat(verseKey, verse.text_uthmani, translations[verseKey])}
                          className={`text-gray-500 hover:text-primary ${copySuccess === verseKey ? 'text-green-500' : ''}`}
                          title="Salin ayat"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => shareAyat(verseKey, verse.text_uthmani, translations[verseKey])}
                          className="text-gray-500 hover:text-primary"
                          title="Bagikan ayat"
                        >
                          <ShareIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <div className="text-right mb-4">
                      <p className="font-arabic text-3xl leading-loose text-gray-900">
                        {verse.text_uthmani}
                      </p>
                    </div>

                    {/* Translation */}
                    <div className="pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {translations[verseKey] || "Memuat terjemahan..."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
