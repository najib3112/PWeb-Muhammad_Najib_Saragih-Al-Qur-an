import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quranAPI } from '../quranAPI';

// Component for displaying a single Surah within a Juz
const SurahInJuz = ({ surah }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-sm mr-4">
          {surah.number}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{surah.name}</h4>
          <p className="text-sm text-gray-500">{surah.translation}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-arabic text-gray-800">{surah.name_arabic}</p>
        <p className="text-sm text-gray-500">{surah.ayahs} Ayat</p>
      </div>
    </div>
  );
};

export default function JuzGrid({ searchTerm = '' }) {
  const [juzs, setJuzs] = useState([]);
  const [surahsByJuz, setSurahsByJuz] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJuzs, setFilteredJuzs] = useState([]);

  useEffect(() => {
    fetchJuzs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJuzs(juzs);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    
    // Filter juzs based on juz number
    const juzMatches = juzs.filter(juz => 
      `juz ${juz.juz_number}`.includes(searchTermLower)
    );
    
    // Filter juzs based on contained surahs
    const surahMatches = juzs.filter(juz => {
      const surahsInThisJuz = surahsByJuz[juz.juz_number] || [];
      return surahsInThisJuz.some(surah => 
        surah.name.toLowerCase().includes(searchTermLower) || 
        surah.translation.toLowerCase().includes(searchTermLower)
      );
    });
    
    // Combine and remove duplicates
    const combinedMatches = [...juzMatches, ...surahMatches];
    const uniqueMatches = Array.from(new Set(combinedMatches.map(juz => juz.juz_number)))
      .map(juzNumber => combinedMatches.find(juz => juz.juz_number === juzNumber));
    
    setFilteredJuzs(uniqueMatches);
  }, [searchTerm, juzs, surahsByJuz]);

  const fetchJuzs = async () => {
    try {
      setLoading(true);
      const data = await quranAPI.getAllJuzs();
      setJuzs(data);
      setFilteredJuzs(data);
      
      // Fetch surahs for each juz
      const surahsData = {};
      for (const juz of data) {
        try {
          const surahsInJuz = await quranAPI.getSurahsInJuz(juz.juz_number);
          surahsData[juz.juz_number] = surahsInJuz;
        } catch (err) {
          console.error(`Error fetching surahs for juz ${juz.juz_number}:`, err);
          surahsData[juz.juz_number] = [];
        }
      }
      
      setSurahsByJuz(surahsData);
    } catch (err) {
      setError('Gagal memuat data juz. Silakan coba lagi nanti.');
      console.error('Error fetching juzs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
        {error}
        <button
          onClick={fetchJuzs}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (filteredJuzs.length === 0 && searchTerm) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Tidak ada hasil untuk "{searchTerm}"
        </h3>
        <p className="text-gray-600">
          Coba kata kunci lain atau periksa ejaan Anda.
        </p>
      </div>
    );
  }

  // Group juzs into pairs for display
  const groupedJuzs = [];
  for (let i = 0; i < filteredJuzs.length; i += 2) {
    if (i + 1 < filteredJuzs.length) {
      groupedJuzs.push([filteredJuzs[i], filteredJuzs[i + 1]]);
    } else {
      groupedJuzs.push([filteredJuzs[i]]);
    }
  }

  return (
    <div className="space-y-6">
      {groupedJuzs.map((juzPair, pairIndex) => (
        <div key={`pair-${pairIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {juzPair.map((juz) => (
            <div key={`juz-${juz.juz_number}`} className="bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center p-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  Juz {juz.juz_number}
                </h3>
                <Link
                  to={`/juz/${juz.juz_number}`}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Read Juz
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {surahsByJuz[juz.juz_number] && surahsByJuz[juz.juz_number].length > 0 ? (
                  <div className="divide-y divide-gray-100 p-4">
                    {surahsByJuz[juz.juz_number].map((surah, surahIndex) => (
                      <SurahInJuz 
                        key={`juz-${juz.juz_number}-surah-${surah.number}-${surahIndex}`} 
                        surah={surah} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 p-4">
                    <p>Surah information not available</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
