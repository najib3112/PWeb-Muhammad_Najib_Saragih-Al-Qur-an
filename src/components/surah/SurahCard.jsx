import { useNavigate } from 'react-router-dom';

export default function SurahCard({ surah }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/surah/${surah.id}`)}
      className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
    >
      {/* Surah Number Circle */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          {surah.id}
        </div>
        
        <div className="flex-1">
          {/* Surah Names */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {surah.name_simple}
              </h3>
              <p className="text-sm text-gray-600">
                {surah.translated_name.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-arabic text-2xl text-primary">
                {surah.name_arabic}
              </p>
            </div>
          </div>

          {/* Surah Info */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">{surah.verses_count}</span> Ayat
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="capitalize">
              {surah.revelation_place}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
    </div>
  );
}