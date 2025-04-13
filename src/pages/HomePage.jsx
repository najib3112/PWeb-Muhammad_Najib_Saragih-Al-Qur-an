import { BookmarkIcon, BookOpenIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import { quranAPI } from '../components/quranAPI';

export default function HomePage() {
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    const lastReadData = quranAPI.getLastRead();
    setLastRead(lastReadData);
  }, []);

  const features = [
    {
      icon: <BookOpenIcon className="h-8 w-8" />,
      title: 'Baca Al-Quran',
      description: 'Baca Al-Quran dengan terjemahan dan tafsir dalam bahasa Indonesia.'
    },
    {
      icon: <SpeakerWaveIcon className="h-8 w-8" />,
      title: 'Dengarkan Murottal',
      description: 'Dengarkan bacaan Al-Quran dari qori-qori terbaik dunia.'
    },
    {
      icon: <BookmarkIcon className="h-8 w-8" />,
      title: 'Bookmark & Riwayat',
      description: 'Simpan ayat favorit dan lanjutkan bacaan terakhir Anda.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fitur Utama
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Mulai Membaca Al-Quran Sekarang
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Akses Al-Quran kapan saja dan di mana saja. Baca, dengarkan, dan pelajari 
            Al-Quran dengan mudah melalui platform kami.
          </p>
          <Link
            to="/surah"
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors duration-300"
          >
            Baca Al-Quran
          </Link>
        </div>
      </section>

      {/* Last Read Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Terakhir Dibaca
              </h3>
              {lastRead ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">
                      Lanjutkan membaca dari...
                    </p>
                    <p className="text-primary font-semibold mt-1">
                      {lastRead.surahName}, Ayat {lastRead.verseNumber}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(lastRead.timestamp).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <Link
                    to={`/surah/${lastRead.surahNumber}`}
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300"
                  >
                    Lanjutkan
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    Anda belum memiliki riwayat bacaan
                  </p>
                  <Link
                    to="/surah"
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300"
                  >
                    Mulai Membaca
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
