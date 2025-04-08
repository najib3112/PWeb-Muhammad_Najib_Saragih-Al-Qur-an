import { BookOpenIcon, BookmarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import SurahGrid from '../components/surah/SurahGrid';

export default function SurahPage() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    {
      id: 'all',
      name: 'Semua Surah',
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

        {/* Surah Grid */}
        {activeTab === 'all' && <SurahGrid />}
        
        {/* Bookmarked Surahs */}
        {activeTab === 'bookmarked' && (
          <div className="text-center py-12">
            <BookmarkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Surah yang Ditandai
            </h3>
            <p className="text-gray-600">
              Tandai surah favorit Anda untuk akses yang lebih cepat.
            </p>
          </div>
        )}

        {/* Recently Read */}
        {activeTab === 'recent' && (
          <div className="text-center py-12">
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
    </div>
  );
}