// src/OverviewTimeline.jsx

import React, { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const eraConfig = {
    "Ancient History": { color: "bg-amber-400", text: "text-amber-800" },
    "Classical Antiquity": { color: "bg-lime-400", text: "text-lime-800" },
    "Post-Classical History": { color: "bg-cyan-400", text: "text-cyan-800" },
    "Modern History": { color: "bg-fuchsia-400", text: "text-fuchsia-800" },
    "Contemporary History": { color: "bg-rose-400", text: "text-rose-800" },
};

// --- Non-linear Scale Calculation ---
const minYear = -10000;
const maxYear = 2024;
const breakPointYear = -4000; // The year where the scale changes

// Allocate 20% of the timeline width to the first 6000 years
const segment1Ratio = 0.2; 
// Allocate 80% of the timeline width to the last ~6000 years
const segment2Ratio = 0.8;

const segment1Duration = breakPointYear - minYear;
const segment2Duration = maxYear - breakPointYear;

const getPosition = (year) => {
    if (year <= breakPointYear) {
        // Calculate position in the first segment
        const progressInSegment = (year - minYear) / segment1Duration;
        return progressInSegment * segment1Ratio * 100;
    } else {
        // Calculate position in the second segment
        const progressInSegment = (year - breakPointYear) / segment2Duration;
        const positionInSegment = progressInSegment * segment2Ratio * 100;
        const segment1Width = segment1Ratio * 100;
        return segment1Width + positionInSegment;
    }
};
// --- End of Scale Calculation ---


const OverviewTimeline = ({ events }) => {

  const eras = useMemo(() => {
    if (!events || events.length === 0) return [];
      
    return Object.entries(events.reduce((acc, event) => {
        if (!acc[event.era]) {
            acc[event.era] = { start: event.year, end: event.year, name: event.era };
        }
        acc[event.era].start = Math.min(acc[event.era].start, event.year);
        acc[event.era].end = Math.max(acc[event.era].end, event.year);
        return acc;
    }, {})).map(([, era]) => era);
  }, [events]);

  if (!events || events.length === 0) return null;

  const handleEventClick = (eventId) => {
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const dateMarkers = [-10000, -8000, -6000, -4000, -2000, 0, 2000];

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-24 px-4 h-32">
        <div className="relative pt-8">
            <div className="relative h-4 bg-slate-200 rounded-full">
                {dateMarkers.map(year => (
                    <div key={year} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${getPosition(year)}%` }}>
                        <div className="w-0.5 h-6 bg-slate-300"></div>
                        <span className="absolute top-full mt-1 text-xs text-slate-500 -translate-x-1/2">
                            {year === 0 ? '0' : `${Math.abs(year)}${year < 0 ? ' BCE' : ' CE'}`}
                        </span>
                    </div>
                ))}
                {events.map((event) => (
                    <div
                        key={event.id}
                        data-tooltip-id="event-tooltip"
                        data-tooltip-content={`${event.title} (${event.date})`}
                        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-150 border-2 border-white shadow-md ${eraConfig[event.era].color}`}
                        style={{ left: `${getPosition(event.year)}%` }}
                        onClick={() => handleEventClick(event.id)}
                    ></div>
                ))}
            </div>
            
            <div className="relative w-full mt-10 h-12">
                {eras.map(({name, start}, index) => {
                    const config = eraConfig[name];
                    const isTop = index % 2 !== 0; // Alternate position
                    return (
                        <div 
                            key={name} 
                            className="absolute"
                            style={{ left: `${getPosition(start)}%` }}
                        >
                            <div className={`absolute -translate-x-1/2 ${isTop ? 'bottom-0 mb-2' : 'top-0 mt-2'} `}>
                                <div className={`relative font-bold text-xs ${config.text}`}>
                                    <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 h-2 ${isTop ? 'top-full' : 'bottom-full'} ${config.color} bg-opacity-50`}></div>
                                    <span className={`block whitespace-nowrap p-1 rounded ${config.color} bg-opacity-20`}>{name}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        <Tooltip id="event-tooltip" place="top" effect="solid" className="z-50"/>
    </div>
  );
};

export default OverviewTimeline;
