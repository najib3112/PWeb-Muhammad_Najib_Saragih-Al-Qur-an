import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import BookmarkPage from './pages/BookmarkPage';
import HomePage from './pages/HomePage';
import JuzDetailPage from './pages/JuzDetailPage';
import JuzPage from './pages/JuzPage';
import SurahDetailPage from './pages/SurahDetailPage';
import SurahPage from './pages/SurahPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="surah" element={<SurahPage />} />
          <Route path="surah/:surahNumber" element={<SurahDetailPage />} />
          <Route path="bookmark" element={<BookmarkPage />} />
          <Route path="juz" element={<JuzPage />} />
          <Route path="juz/:juzNumber" element={<JuzDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
