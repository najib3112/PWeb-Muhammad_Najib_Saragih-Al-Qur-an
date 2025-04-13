import { BookmarkIcon, ChevronLeftIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quranAPI } from '../components/quranAPI';

export default function SurahDetailPage() {
  const { surahNumber } = useParams();
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoadingReciters, setIsLoadingReciters] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isActionLoading, setIsActionLoading] = useState({ copy: false, share: false });
  const [bookmarks, setBookmarks] = useState([]);
  const [lastRead, setLastRead] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSurahDetails();
    fetchReciters();
    // Load bookmarks and last read
    setBookmarks(quranAPI.getBookmarks());
    setLastRead(quranAPI.getLastRead());
  }, [surahNumber]);

  // Set last read when opening surah
  useEffect(() => {
    if (surahData) {
      const { surah } = surahData;
      quranAPI.setLastRead(parseInt(surahNumber), 1, surah.name_simple);
      setLastRead({
        surahNumber: parseInt(surahNumber),
        verseNumber: 1,
        surahName: surah.name_simple
      });
    }
  }, [surahData, surahNumber]);

  useEffect(() => {
    if (selectedReciter) {
      fetchAudio();
    }
  }, [selectedReciter]);

  const fetchReciters = async () => {
    try {
      setIsLoadingReciters(true);
      const data = await quranAPI.getReciters();
      setReciters(data.recitations);
      // Set default reciter
      if (data.recitations.length > 0) {
        setSelectedReciter(data.recitations[0].id);
      }
    } catch (err) {
      console.error('Error fetching reciters:', err);
    } finally {
      setIsLoadingReciters(false);
    }
  };

  const fetchAudio = async () => {
    try {
      setIsLoadingAudio(true);
      const data = await quranAPI.getSurahAudio(selectedReciter, surahNumber);
      setAudioUrl(data.audio_file.audio_url);
    } catch (err) {
      console.error('Error fetching audio:', err);
      setAudioUrl(null);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReciterChange = (e) => {
    setSelectedReciter(e.target.value);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const fetchSurahDetails = async () => {
    try {
      setLoading(true);
      const data = await quranAPI.getSurahDetails(surahNumber);
      // Tambahkan nomor ayat ke setiap ayat
      const versesWithNumbers = data.verses.map((verse, index) => ({
        ...verse,
        verse_number: index + 1
      }));
      setSurahData({
        ...data,
        verses: versesWithNumbers
      });
    } catch (err) {
      setError('Gagal memuat detail surah. Silakan coba lagi nanti.');
      console.error('Error fetching surah details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = (verseNumber) => {
    try {
      const isBookmarked = bookmarks.some(
        b => b.surahNumber === parseInt(surahNumber) && b.verseNumber === verseNumber
      );

      if (isBookmarked) {
        const updatedBookmarks = quranAPI.removeBookmark(parseInt(surahNumber), verseNumber);
        setBookmarks(updatedBookmarks);
        setNotification({ show: true, message: 'Bookmark dihapus', type: 'success' });
      } else {
        const updatedBookmarks = quranAPI.addBookmark(
          parseInt(surahNumber),
          verseNumber,
          surahData.surah.name_simple
        );
        setBookmarks(updatedBookmarks);
        setNotification({ show: true, message: 'Bookmark ditambahkan', type: 'success' });
      }
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
    } catch (error) {
      console.error('Error managing bookmark:', error);
      setNotification({ show: true, message: 'Gagal mengelola bookmark', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
    }
  };

  const handleSetLastRead = (verseNumber) => {
    try {
      const updatedLastRead = quranAPI.setLastRead(
        parseInt(surahNumber),
        verseNumber,
        surahData.surah.name_simple
      );
      setLastRead(updatedLastRead);
      setNotification({ show: true, message: 'Terakhir dibaca diperbarui', type: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
    } catch (error) {
      console.error('Error setting last read:', error);
      setNotification({ show: true, message: 'Gagal mengatur terakhir dibaca', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
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
            onClick={fetchSurahDetails}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!surahData) return null;

  const { surah, verses, translations, transliterations } = surahData;

  const handleCopyAyat = async (verse, translation, index) => {
    setIsActionLoading(prev => ({ ...prev, copy: true }));
    const textToCopy = `${verse.text_uthmani}\n\n${translation.text}\n\n(QS. ${surah.name_simple} [${surah.id}]:${index + 1})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setNotification({ show: true, message: 'Ayat berhasil disalin', type: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
    } catch (err) {
      console.error('Gagal menyalin ayat:', err);
      setNotification({ show: true, message: 'Gagal menyalin ayat', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
    } finally {
      setIsActionLoading(prev => ({ ...prev, copy: false }));
    }
  };

  const handleShareAyat = async (verse, translation, index) => {
    setIsActionLoading(prev => ({ ...prev, share: true }));
    const textToShare = `${verse.text_uthmani}\n\n${translation.text}\n\n(QS. ${surah.name_simple} [${surah.id}]:${index + 1})`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `QS. ${surah.name_simple} [${surah.id}]:${index + 1}`,
          text: textToShare
        });
        setNotification({ show: true, message: 'Ayat berhasil dibagikan', type: 'success' });
      } else {
        await navigator.clipboard.writeText(textToShare);
        setNotification({ show: true, message: 'Link ayat berhasil disalin', type: 'success' });
      }
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
    } catch (err) {
      console.error('Gagal membagikan ayat:', err);
      setNotification({ show: true, message: 'Gagal membagikan ayat', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
    } finally {
      setIsActionLoading(prev => ({ ...prev, share: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Notifikasi */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 ${notification.type === 'error' ? 'bg-red-500' : 'bg-primary'} text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up flex items-center gap-2`}>
          {notification.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          {notification.message}
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        {/* Audio Player */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedReciter}
              onChange={handleReciterChange}
              disabled={isLoadingReciters}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
            >
              {isLoadingReciters ? (
                <option>Loading reciters...</option>
              ) : (
                reciters.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.reciter_name}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={handlePlayPause}
              disabled={!audioUrl || isLoadingAudio}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoadingAudio ? (
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin opacity-75"></div>
              ) : isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>
        <Link
          to="/surah"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Daftar Surah
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {surah.name_simple} ({surah.name_arabic})
          </h1>
          <p className="text-gray-600 mb-4">
            {surah.translated_name.name}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span>{surah.verses_count} Ayat</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="capitalize">{surah.revelation_place}</span>
          </div>
        </div>
      </div>

      {/* Verses */}
      <div className="space-y-8">
        {verses.map((verse, index) => {
          const isBookmarked = bookmarks.some(
            b => b.surahNumber === parseInt(surahNumber) && b.verseNumber === (index + 1)
          );
          const isLastRead = lastRead && 
            lastRead.surahNumber === parseInt(surahNumber) && 
            lastRead.verseNumber === (index + 1);

          return (
            <div
              key={verse.id}
              className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
                isLastRead ? 'border-2 border-primary' : ''
              }`}
            >
              {/* Nomor Ayat dan Aksi */}
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-lg">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSetLastRead(index + 1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Tandai Terakhir Dibaca"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isLastRead ? 'text-primary' : 'text-gray-600'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleBookmark(index + 1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title={isBookmarked ? "Hapus Bookmark" : "Tambah Bookmark"}
                  >
                    {isBookmarked ? (
                      <BookmarkSolidIcon className="w-5 h-5 text-primary" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleCopyAyat(verse, translations[index], index)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" 
                    title="Salin Ayat"
                    disabled={isActionLoading.copy}
                  >
                    {isActionLoading.copy ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                      </svg>
                    )}
                  </button>
                  <button 
                    onClick={() => handleShareAyat(verse, translations[index], index)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" 
                    title="Bagikan Ayat"
                    disabled={isActionLoading.share}
                  >
                    {isActionLoading.share ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="text-right mb-4 select-all">
                <p className="font-arabic text-3xl leading-loose text-gray-900">
                  {verse.text_uthmani}
                </p>
              </div>

              {/* Transliteration */}
              {transliterations && transliterations[index] && (
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed italic">
                    {transliterations[index].text}
                  </p>
                </div>
              )}

              {/* Translation */}
              <div className="border-t pt-4">
                <p className="text-gray-600 leading-relaxed">
                  {translations[index].text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
