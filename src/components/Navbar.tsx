import { Link, useLocation } from 'react-router-dom';
import { REGIONS } from '../data/events';

const getRegionColor = (region: string) => {
  switch (region) {
    case 'Europe':
      return 'text-blue-400 hover:text-blue-300';
    case 'Africa & Middle East':
      return 'text-red-400 hover:text-red-300';
    case 'Asia Pacific':
      return 'text-emerald-400 hover:text-emerald-300';
    case 'Americas':
      return 'text-violet-400 hover:text-violet-300';
    default:
      return 'text-neutral-400 hover:text-neutral-300';
  }
};

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800 shadow-lg">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center pl-4">
          <Link to="/" className="flex items-center gap-2 text-neutral-100">
            <img 
              src="/Blank_globe.svg.png" 
              alt="Globe" 
              className="w-6 h-6 opacity-80"
            />
            <span className="text-xl font-semibold">chronovos</span>
          </Link>
        </div>
        
        <div className="flex space-x-8 pr-4">
          <Link
            to="/"
            className={`${
              currentPath === '/' ? 'text-neutral-100' : 'text-neutral-400'
            } hover:text-neutral-300 transition-colors duration-200`}
          >
            All Regions
          </Link>
          {REGIONS.map((region) => (
            <Link
              key={region}
              to={`/region/${region.toLowerCase().replace(/ & /g, '-')}`}
              className={`${
                currentPath === `/region/${region.toLowerCase().replace(/ & /g, '-')}` 
                  ? getRegionColor(region)
                  : 'text-neutral-400'
              } transition-colors duration-200`}
            >
              {region}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 