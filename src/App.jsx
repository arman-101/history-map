import React, { useState, useEffect, useMemo } from 'react';
import Timeline from './Timeline';
import OverviewTimeline from './OverviewTimeline';
import { historicalEvents } from './data';

const allEras = [...new Set(historicalEvents.map(e => e.era))];

const App = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeEras, setActiveEras] = useState(allEras);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    return historicalEvents.filter(event => {
      const eraMatch = activeEras.includes(event.era);
      const searchTermMatch = searchTerm.length < 2 || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return eraMatch && searchTermMatch;
    });
  }, [activeEras, searchTerm]);

  const toggleEra = (era) => {
    setActiveEras(prev => 
      prev.includes(era) ? prev.filter(e => e !== era) : [...prev, era]
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* Revamped Header/Nav Section */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-screen-2xl mx-auto">
          {/* Left Side: Title & Stats */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <img src="/icon.png" alt="Timeline Icon" className="h-10 w-10"/>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                A Journey Through Time
              </h1>
              <p className="text-xs text-slate-500">
                {historicalEvents.length} Events • {allEras.length} Eras
              </p>
            </div>
          </div>

          {/* Right Side: Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <input
                type="text"
                placeholder="Search events..."
                className="px-4 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none w-full sm:w-48 transition"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2">
              {allEras.map(era => (
                  <button 
                      key={era}
                      onClick={() => toggleEra(era)}
                      className={`px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${activeEras.includes(era) ? 'bg-slate-800 text-white shadow' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                  >
                      {era}
                  </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Overview Timeline Section */}
      <section className="bg-white/50 border-b border-slate-200 py-4">
        <OverviewTimeline allEvents={historicalEvents} filteredEvents={filteredEvents} />
      </section>
      
      <main>
        <Timeline events={filteredEvents} />
      </main>

      <footer className="text-center py-10 bg-white border-t border-slate-200 text-slate-500">
        <p>An interactive timeline by a history enthusiast. Powered by Gemini.</p>
        <p className="text-xs mt-2">Inspired by <a href="https://youtu.be/xuCn8ux2gbs" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">bill wurtz</a> and <a href="https://youtu.be/__BaaMfiDQ" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">North 02</a>.</p>
      </footer>

      {showScrollTop && (
         <button 
            onClick={scrollTop}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-slate-700 hover:scale-110 active:scale-100"
            aria-label="Scroll to top"
        >
            <i className="fa-solid fa-arrow-up text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default App;