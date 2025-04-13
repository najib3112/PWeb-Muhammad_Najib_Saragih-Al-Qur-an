const BASE_URL = 'https://api.quran.com/api/v4';
const TRANSLATION_URL = 'http://api.alquran.cloud/v1';

// Keys untuk localStorage
const BOOKMARK_KEY = 'quran_bookmarks';
const LAST_READ_KEY = 'quran_last_read';

// Fungsi helper untuk localStorage
const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const quranAPI = {
  getAllSurahs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/chapters`);
      const data = await response.json();
      return data.chapters;
    } catch (error) {
      console.error('Error fetching surahs:', error);
      throw error;
    }
  },

  getAllJuzs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/juzs`);
      const data = await response.json();
      
      // Filter duplikat berdasarkan juz_number
      const uniqueJuzs = [];
      const seenJuzNumbers = new Set();

      data.juzs.forEach((juz) => {
        if (!seenJuzNumbers.has(juz.juz_number)) {
          seenJuzNumbers.add(juz.juz_number);
          uniqueJuzs.push(juz);
        }
      });
      
      return uniqueJuzs;
    } catch (error) {
      console.error('Error fetching juzs:', error);
      throw error;
    }
  },

  getJuzDetails: async (juzNumber) => {
    try {
      const params = new URLSearchParams({
        language: 'id',
        words: false,
        translations: '33',
        per_page: '50',
        page: '1',
        fields: 'text_uthmani,verse_key'
      });

      const response = await fetch(`${BASE_URL}/verses/by_juz/${juzNumber}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      return {
        verses: data.verses,
        pagination: data.pagination
      };
    } catch (error) {
      console.error('Error fetching juz details:', error);
      throw error;
    }
  },

  // Mendapatkan surah dalam juz tertentu berdasarkan verse_mapping
  getSurahsInJuz: async (juzNumber) => {
    try {
      const response = await fetch(`${BASE_URL}/juzs`);
      const data = await response.json();
      
      // Find the juz with the specified juz_number
      const juz = data.juzs.find(j => j.juz_number === juzNumber);
      
      if (!juz) {
        return [];
      }
      
      // Get the verse_mapping from the juz
      const verseMapping = juz.verse_mapping;
      
      // Get all surah numbers in this juz
      const surahNumbers = Object.keys(verseMapping);
      
      // Fetch all surahs
      const surahsResponse = await fetch(`${BASE_URL}/chapters?language=en`);
      const surahsData = await surahsResponse.json();
      const allSurahs = surahsData.chapters;
      
      // Filter surahs that are in this juz
      const surahsInJuz = allSurahs.filter(surah => 
        surahNumbers.includes(surah.id.toString())
      ).map(surah => ({
        number: surah.id,
        name: surah.name_simple,
        name_arabic: surah.name_arabic,
        translation: surah.translated_name.name,
        ayahs: surah.verses_count
      }));
      
      return surahsInJuz;
    } catch (error) {
      console.error(`Error fetching surahs for juz ${juzNumber}:`, error);
      return [];
    }
  },

  getSurahDetails: async (surahNumber) => {
    try {
      const [surahResponse, versesResponse, translationResponse, transliterationResponse] = await Promise.all([
        fetch(`${BASE_URL}/chapters/${surahNumber}`).then(res => res.json()),
        fetch(`${BASE_URL}/quran/verses/uthmani?chapter_number=${surahNumber}`).then(res => res.json()),
        fetch(`${BASE_URL}/quran/translations/33?chapter_number=${surahNumber}`).then(res => res.json()),
        fetch(`${BASE_URL}/quran/translations/40?chapter_number=${surahNumber}`).then(res => res.json())
      ]);

      const verses = versesResponse.verses.map(verse => ({
        ...verse,
        verse_number: parseInt(verse.verse_key.split(':')[1])
      }));

      return {
        surah: surahResponse.chapter,
        verses,
        translations: translationResponse.translations.map(trans => ({
          ...trans,
          text: trans.text.replace(/<sup.*?<\/sup>/g, '')
        })),
        transliterations: transliterationResponse.translations
      };
    } catch (error) {
      console.error('Error fetching surah details:', error);
      throw error;
    }
  },

  getTranslation: async () => {
    try {
      const response = await fetch(`${TRANSLATION_URL}/quran/en.asad`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching translation:', error);
      throw error;
    }
  },

  getReciters: async () => {
    try {
      const response = await fetch(`${BASE_URL}/resources/recitations`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reciters:', error);
      throw error;
    }
  },

  getSurahAudio: async (reciterId, surahNumber) => {
    try {
      const response = await fetch(`${BASE_URL}/chapter_recitations/${reciterId}/${surahNumber}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching surah audio:', error);
      throw error;
    }
  },

  getBookmarks: () => {
    return getStorageItem(BOOKMARK_KEY, []);
  },

  addBookmark: (surahNumber, verseNumber, surahName) => {
    const bookmarks = getStorageItem(BOOKMARK_KEY, []);
    const newBookmark = {
      surahNumber,
      verseNumber,
      surahName,
      timestamp: new Date().toISOString()
    };
    
    const existingIndex = bookmarks.findIndex(
      b => b.surahNumber === surahNumber && b.verseNumber === verseNumber
    );
    
    if (existingIndex === -1) {
      bookmarks.push(newBookmark);
      setStorageItem(BOOKMARK_KEY, bookmarks);
    }
    
    return bookmarks;
  },

  removeBookmark: (surahNumber, verseNumber) => {
    const bookmarks = getStorageItem(BOOKMARK_KEY, []);
    const filteredBookmarks = bookmarks.filter(
      b => !(b.surahNumber === surahNumber && b.verseNumber === verseNumber)
    );
    setStorageItem(BOOKMARK_KEY, filteredBookmarks);
    return filteredBookmarks;
  },

  getLastRead: () => {
    return getStorageItem(LAST_READ_KEY, null);
  },

  setLastRead: (surahNumber, verseNumber, surahName) => {
    const lastRead = {
      surahNumber,
      verseNumber,
      surahName,
      timestamp: new Date().toISOString()
    };
    setStorageItem(LAST_READ_KEY, lastRead);
    return lastRead;
  }
};
