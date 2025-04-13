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
    // Return Promise yang resolve ke array statis
    return Promise.resolve([
      { id: 1, juz_number: 1, verses_count: 148, first_verse_id: "1:1", last_verse_id: "2:141" },
      { id: 2, juz_number: 2, verses_count: 111, first_verse_id: "2:142", last_verse_id: "2:252" },
      { id: 3, juz_number: 3, verses_count: 125, first_verse_id: "2:253", last_verse_id: "3:92" },
      { id: 4, juz_number: 4, verses_count: 132, first_verse_id: "3:93", last_verse_id: "4:23" },
      { id: 5, juz_number: 5, verses_count: 124, first_verse_id: "4:24", last_verse_id: "4:147" },
      { id: 6, juz_number: 6, verses_count: 110, first_verse_id: "4:148", last_verse_id: "5:81" },
      { id: 7, juz_number: 7, verses_count: 149, first_verse_id: "5:82", last_verse_id: "6:110" },
      { id: 8, juz_number: 8, verses_count: 142, first_verse_id: "6:111", last_verse_id: "7:87" },
      { id: 9, juz_number: 9, verses_count: 159, first_verse_id: "7:88", last_verse_id: "8:40" },
      { id: 10, juz_number: 10, verses_count: 127, first_verse_id: "8:41", last_verse_id: "9:92" },
      { id: 11, juz_number: 11, verses_count: 151, first_verse_id: "9:93", last_verse_id: "11:5" },
      { id: 12, juz_number: 12, verses_count: 170, first_verse_id: "11:6", last_verse_id: "12:52" },
      { id: 13, juz_number: 13, verses_count: 155, first_verse_id: "12:53", last_verse_id: "14:52" },
      { id: 14, juz_number: 14, verses_count: 227, first_verse_id: "15:1", last_verse_id: "16:128" },
      { id: 15, juz_number: 15, verses_count: 185, first_verse_id: "17:1", last_verse_id: "18:74" },
      { id: 16, juz_number: 16, verses_count: 269, first_verse_id: "18:75", last_verse_id: "20:135" },
      { id: 17, juz_number: 17, verses_count: 190, first_verse_id: "21:1", last_verse_id: "22:78" },
      { id: 18, juz_number: 18, verses_count: 202, first_verse_id: "23:1", last_verse_id: "25:20" },
      { id: 19, juz_number: 19, verses_count: 339, first_verse_id: "25:21", last_verse_id: "27:55" },
      { id: 20, juz_number: 20, verses_count: 171, first_verse_id: "27:56", last_verse_id: "29:45" },
      { id: 21, juz_number: 21, verses_count: 178, first_verse_id: "29:46", last_verse_id: "33:30" },
      { id: 22, juz_number: 22, verses_count: 169, first_verse_id: "33:31", last_verse_id: "36:27" },
      { id: 23, juz_number: 23, verses_count: 357, first_verse_id: "36:28", last_verse_id: "39:31" },
      { id: 24, juz_number: 24, verses_count: 175, first_verse_id: "39:32", last_verse_id: "41:46" },
      { id: 25, juz_number: 25, verses_count: 246, first_verse_id: "41:47", last_verse_id: "45:37" },
      { id: 26, juz_number: 26, verses_count: 195, first_verse_id: "46:1", last_verse_id: "51:30" },
      { id: 27, juz_number: 27, verses_count: 399, first_verse_id: "51:31", last_verse_id: "57:29" },
      { id: 28, juz_number: 28, verses_count: 137, first_verse_id: "58:1", last_verse_id: "66:12" },
      { id: 29, juz_number: 29, verses_count: 431, first_verse_id: "67:1", last_verse_id: "77:50" },
      { id: 30, juz_number: 30, verses_count: 564, first_verse_id: "78:1", last_verse_id: "114:6" }
    ]);
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
