import { ClockIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quranAPI } from '../quranAPI';

export default function SurahCard({ surah }) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLastRead, setIsLastRead] = useState(false);

  useEffect(() => {
    // Cek status bookmark
    const bookmarks = quranAPI.getBookmarks();
    const bookmarked = bookmarks.some(b => b.surahNumber === surah.id);
    setIsBookmarked(bookmarked);

    // Cek status last read
    const lastRead = quranAPI.getLastRead();
    const isLast = lastRead && lastRead.surahNumber === surah.id;
    setIsLastRead(isLast);
  }, [surah.id]);

  return (
    <div 
      onClick={() => navigate(`/surah/${surah.id}`)}
      className={`card hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative bg-white rounded-lg p-6 ${
        isLastRead ? 'border-2 border-primary' : ''
      }`}
    >
      {/* Status Indicators */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isBookmarked && (
          <BookmarkSolidIcon className="h-5 w-5 text-primary" />
        )}
        {isLastRead && (
          <ClockIcon className="h-5 w-5 text-primary" />
        )}
      </div>

      {/* Surah Number Circle */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          {surah.id}
        </div>
        
        <div className="flex-1">
          {/* Surah Names */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {surah.name_simple}
              </h3>
              <p className="text-sm text-gray-600">
                {surah.translated_name.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-arabic text-2xl text-primary">
                {surah.name_arabic}
              </p>
            </div>
          </div>

          {/* Surah Info */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">{surah.verses_count}</span> Ayat
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="capitalize">
              {surah.revelation_place}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
    </div>
  );
}
