// src/App.jsx

import React, { useState, useEffect } from 'react';
import Timeline from './Timeline';
import OverviewTimeline from './OverviewTimeline';
import { historicalEvents } from './data';

const App = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.scrollY > 400){
        setShowScrollTop(true);
      } else if (showScrollTop && window.scrollY <= 400){
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);

  const scrollTop = () => {
    setIsPulsing(true);
    window.scrollTo({top: 0, behavior: 'smooth'});
    setTimeout(() => setIsPulsing(false), 1000); // Animation duration
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <header className="text-center pt-16 pb-4 border-b border-slate-200">
        <div className="flex justify-center items-center gap-4 mb-4">
            <img src="/icon.png" alt="Timeline Icon" className="h-14 w-14"/>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              A Journey Through Time
            </h1>
        </div>
        <p className="text-lg text-slate-500 mt-4 max-w-3xl mx-auto">
          An interactive exploration of the pivotal moments that have shaped our world.
        </p>
        <OverviewTimeline events={historicalEvents} />
      </header>
      <main>
        <Timeline />
      </main>
      <footer className="text-center py-10 bg-white border-t border-slate-200 text-slate-500">
        <p>An interactive timeline by a history enthusiast.</p>
      </footer>

      {showScrollTop && (
         <button 
            onClick={scrollTop}
            className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg transition-opacity duration-300 hover:bg-slate-700 ${isPulsing ? 'animate-pulse' : ''}`}
            aria-label="Scroll to top"
        >
            <i className="fa-solid fa-arrow-up text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default App;
