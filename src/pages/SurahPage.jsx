import { BookOpenIcon, BookmarkIcon, ClockIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JuzGrid from '../components/juz/JuzGrid';
import { quranAPI } from '../components/quranAPI';
import SurahGrid from '../components/surah/SurahGrid';

export default function SurahPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState([]);
  const [lastReadSurah, setLastReadSurah] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const tabs = [
    {
      id: 'all',
      name: 'Semua Surah',
      icon: <BookOpenIcon className="h-5 w-5" />
    },
    {
      id: 'juz',
      name: 'Juz',
      icon: <BookOpenIcon className="h-5 w-5" />
    },
    {
      id: 'bookmarked',
      name: 'Ditandai',
      icon: <BookmarkIcon className="h-5 w-5" />
    },
    {
      id: 'recent',
      name: 'Terakhir Dibaca',
      icon: <ClockIcon className="h-5 w-5" />
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Reset search when tab changes
    setSearchTerm('');
  }, [activeTab]);

  const loadData = () => {
    const bookmarks = quranAPI.getBookmarks();
    setBookmarkedSurahs(bookmarks);

    const lastRead = quranAPI.getLastRead();
    setLastReadSurah(lastRead);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Surah Al-Quran
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Baca dan pelajari Al-Quran dengan terjemahan bahasa Indonesia. 
            Tersedia 114 surah lengkap dengan audio murottal.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-4 py-2 rounded-md transition-colors duration-200
                  ${activeTab === tab.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                {tab.icon}
                <span className="ml-2">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Single Search Bar for all tabs */}
        {(activeTab === 'all' || activeTab === 'juz') && (
          <div className="mb-8 relative max-w-2xl mx-auto">
            <div className={`flex items-center border ${isSearchFocused ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'} rounded-lg overflow-hidden transition-all duration-200`}>
              <div className="pl-4">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari surah atau juz berdasarkan nama atau nomor..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'all' && <SurahGrid searchTerm={searchTerm} />}
        
        {/* Juz Grid */}
        {activeTab === 'juz' && <JuzGrid searchTerm={searchTerm} />}
        
        {/* Bookmarked Surahs */}
        {activeTab === 'bookmarked' && (
          <div className="text-center py-12">
            {bookmarkedSurahs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarkedSurahs.map((bookmark) => (
                  <div 
                    key={`${bookmark.surahNumber}-${bookmark.verseNumber}`} 
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <Link 
                      to={`/surah/${bookmark.surahNumber}`} 
                      className="block"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {bookmark.surahName}
                      </h3>
                      <p className="text-gray-600">
                        Ayat {bookmark.verseNumber}
                      </p>
                      <div className="mt-4 text-primary">
                        Baca Sekarang →
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <BookmarkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Belum Ada Surah yang Ditandai
                </h3>
                <p className="text-gray-600">
                  Tandai surah favorit Anda untuk akses yang lebih cepat.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recently Read */}
        {activeTab === 'recent' && (
          <div className="text-center py-12">
            {lastReadSurah ? (
              <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto hover:shadow-md transition-shadow">
                <Link 
                  to={`/surah/${lastReadSurah.surahNumber}`}
                  className="block"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {lastReadSurah.surahName}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Terakhir dibaca: Ayat {lastReadSurah.verseNumber}
                  </p>
                  <div className="text-primary">
                    Lanjutkan Membaca →
                  </div>
                </Link>
              </div>
            ) : (
              <div>
                <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Belum Ada Riwayat Bacaan
                </h3>
                <p className="text-gray-600">
                  Surah yang Anda baca akan muncul di sini.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
