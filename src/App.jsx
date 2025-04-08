import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
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
        </Route>
      </Routes>
    </Router>
  );
}
