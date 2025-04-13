import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quranAPI } from '../components/quranAPI';

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const loadedBookmarks = quranAPI.getBookmarks();
    setBookmarks(loadedBookmarks);
  }, []);

  const handleRemoveBookmark = (surahNumber, verseNumber) => {
    const updatedBookmarks = quranAPI.removeBookmark(surahNumber, verseNumber);
    setBookmarks(updatedBookmarks);
  };

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookmark</h1>
        <div className="text-center text-gray-600">
          Belum ada ayat yang ditandai
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookmark</h1>
      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <div
            key={`${bookmark.surahNumber}-${bookmark.verseNumber}`}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <Link
                to={`/surah/${bookmark.surahNumber}`}
                className="text-lg font-medium text-primary hover:text-primary/80"
              >
                {bookmark.surahName}
              </Link>
              <p className="text-sm text-gray-600">
                Ayat {bookmark.verseNumber}
              </p>
            </div>
            <button
              onClick={() => handleRemoveBookmark(bookmark.surahNumber, bookmark.verseNumber)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Hapus Bookmark"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
