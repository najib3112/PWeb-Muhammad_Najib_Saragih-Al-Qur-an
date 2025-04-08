import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>© {new Date().getFullYear()} Al-Quran Web. Dibuat dengan ❤️ untuk umat Islam.</p>
            <p className="text-sm mt-2">
              Data Al-Quran disediakan oleh{' '}
              <a 
                href="https://quran.api-docs.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Quran.com API
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}