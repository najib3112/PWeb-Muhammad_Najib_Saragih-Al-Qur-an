import axios from 'axios';

const BASE_URL = 'https://api.quran.com/api/v4';
const TRANSLATION_URL = 'http://api.alquran.cloud/v1';

export const quranAPI = {
  // Get list of all surahs
  getAllSurahs: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chapters`);
      return response.data.chapters;
    } catch (error) {
      console.error('Error fetching surahs:', error);
      throw error;
    }
  },

  // Get Surah Details with verses
  getSurahDetails: async (surahNumber) => {
    try {
      const [surahResponse, versesResponse, translationResponse, transliterationResponse] = await Promise.all([
        axios.get(`${BASE_URL}/chapters/${surahNumber}`),
        axios.get(`${BASE_URL}/quran/verses/uthmani?chapter_number=${surahNumber}`),
        axios.get(`${BASE_URL}/quran/translations/33?chapter_number=${surahNumber}`),
        axios.get(`${BASE_URL}/quran/translations/40?chapter_number=${surahNumber}`) // English transliteration
      ]);

      // Dapatkan data ayat dengan nomor ayat yang benar
      const verses = versesResponse.data.verses.map(verse => ({
        ...verse,
        verse_number: parseInt(verse.verse_key.split(':')[1])
      }));

      return {
        surah: surahResponse.data.chapter,
        verses,
        translations: translationResponse.data.translations.map(trans => ({
          ...trans,
          text: trans.text.replace(/<sup.*?<\/sup>/g, '') // Remove footnote tags
        })),
        transliterations: transliterationResponse.data.translations
      };
    } catch (error) {
      console.error('Error fetching surah details:', error);
      throw error;
    }
  },

  // Get translation
  getTranslation: async () => {
    try {
      const response = await axios.get(`${TRANSLATION_URL}/quran/en.asad`);
      return response.data;
    } catch (error) {
      console.error('Error fetching translation:', error);
      throw error;
    }
  },

  // Get list of reciters
  getReciters: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/resources/recitations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reciters:', error);
      throw error;
    }
  },

  // Get audio for specific surah
  getSurahAudio: async (reciterId, surahNumber) => {
    try {
      const response = await axios.get(`${BASE_URL}/chapter_recitations/${reciterId}/${surahNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching surah audio:', error);
      throw error;
    }
  }
};