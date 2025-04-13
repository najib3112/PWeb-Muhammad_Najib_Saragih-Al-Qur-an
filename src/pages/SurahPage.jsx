import { BookOpenIcon, BookmarkIcon, ClockIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quranAPI } from '../components/quranAPI';
import SurahGrid from '../components/surah/SurahGrid';

const SurahInJuz = ({ surah }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = quranAPI.getBookmarks();
    setIsBookmarked(bookmarks.some(b => b.surahNumber === surah.number));
  }, [surah.number]);

  const handlePlayAudio = async () => {
    try {
      setIsPlaying(true);
      await quranAPI.getSurahAudio(1, surah.number); // 1 adalah ID reciter default
      // Implementasi pemutaran audio
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      quranAPI.removeBookmark(surah.number, 1);
    } else {
      quranAPI.addBookmark(surah.number, 1, surah.name);
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex items-center py-4">
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-sm">
        {surah.number}
      </div>
      <div className="flex-1 ml-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{surah.name}</h4>
            <p className="text-sm text-gray-500">{surah.translation}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-arabic">{surah.nameArabic}</p>
            <p className="text-sm text-gray-500">{surah.ayahs}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={handlePlayAudio}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
          disabled={isPlaying}
        >
          <SpeakerWaveIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleBookmark}
          className={`p-2 transition-colors ${isBookmarked ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
        >
          <BookmarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const JuzSection = ({ juz }) => {
  // Jika tidak ada data surah, tampilkan informasi dasar juz saja
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Juz {juz.juz_number}</h3>
          <p className="text-sm text-gray-600">{juz.verses_count} Ayat</p>
        </div>
        <Link
          to={`/juz/${juz.juz_number}`}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Baca Juz →
        </Link>
      </div>
      <div className="text-sm text-gray-600">
        <p>Dimulai dari: {juz.first_verse_id}</p>
        <p>Berakhir di: {juz.last_verse_id}</p>
      </div>
    </div>
  );
};

export default function SurahPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState([]);
  const [lastReadSurah, setLastReadSurah] = useState(null);
  const [juzs, setJuzs] = useState([]);

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
    if (activeTab === 'juz') {
      const fetchJuzs = async () => {
        try {
          const data = await quranAPI.getAllJuzs();
          setJuzs(data);
        } catch (error) {
          console.error('Error fetching juzs:', error);
        }
      };
      fetchJuzs();
    }
  }, [activeTab]);

  const loadData = () => {
    const bookmarks = quranAPI.getBookmarks();
    setBookmarkedSurahs(bookmarks);

    const lastRead = quranAPI.getLastRead();
    setLastReadSurah(lastRead);
  };

  const renderJuzGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
        {juzs.map((juz) => (
          <JuzSection key={juz.juz_number} juz={juz} />
        ))}
      </div>
    );
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

        {/* Search Bar */}
        {activeTab === 'all' && (
          <div className="mb-8">
            <input
              type="text"
              placeholder="Cari surah berdasarkan nama atau nomor..."
              className="w-full max-w-2xl mx-auto block px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        )}

        {/* Content */}
        {activeTab === 'all' && <SurahGrid />}
        
        {/* Juz Grid */}
        {activeTab === 'juz' && renderJuzGrid()}
        
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
