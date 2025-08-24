import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const eraConfig = {
    "Ancient History": { color: "bg-amber-400" },
    "Classical Antiquity": { color: "bg-lime-400" },
    "Post-Classical History": { color: "bg-cyan-400" },
    "Modern History": { color: "bg-fuchsia-400" },
    "Contemporary History": { color: "bg-rose-400" },
};

const MIN_ZOOM_YEARS = 50; // Set a minimum year span for zooming

const OverviewTimeline = ({ allEvents, filteredEvents }) => {
  const [minYear, maxYear] = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return [0, 0];
    const years = allEvents.map(e => e.year);
    return [Math.min(...years), Math.max(...years, new Date().getFullYear())];
  }, [allEvents]);

  const [viewRange, setViewRange] = useState({ start: minYear, end: maxYear });

  // Reset view when events change (e.g., initial load)
  useEffect(() => {
    setViewRange({ start: minYear, end: maxYear });
  }, [minYear, maxYear]);

  const { getPosition, dateMarkers } = useMemo(() => {
    const { start, end } = viewRange;
    const duration = end - start;
    if (duration <= 0) return { getPosition: () => 0, dateMarkers: [] };

    // --- Non-linear Scale for Full View ---
    const breakPointYear = -4000;
    const isFullView = start === minYear && end === maxYear;

    const getPosition = (year) => {
      if (isFullView) {
        const segment1Ratio = 0.2;
        const segment1Duration = breakPointYear - minYear;
        const segment2Duration = maxYear - breakPointYear;
        if (year <= breakPointYear) {
          return ((year - minYear) / segment1Duration) * segment1Ratio * 100;
        } else {
          return (segment1Ratio + ((year - breakPointYear) / segment2Duration) * (1 - segment1Ratio)) * 100;
        }
      } else {
        // Linear scale for zoomed view
        return ((year - start) / duration) * 100;
      }
    };

    const markers = new Set();
    const interval = Math.pow(10, Math.floor(Math.log10(duration / 4))); // Dynamic interval
    const firstMarker = Math.ceil(start / interval) * interval;
    for (let year = firstMarker; year < end; year += interval) {
      markers.add(year);
    }

    return { getPosition, dateMarkers: Array.from(markers) };
  }, [viewRange, minYear, maxYear]);

  const handleZoom = (factor) => {
    const { start, end } = viewRange;
    const currentDuration = end - start;
    const midPoint = start + currentDuration / 2;
    let newDuration = currentDuration * factor;

    if (newDuration < MIN_ZOOM_YEARS) newDuration = MIN_ZOOM_YEARS;
    if (newDuration > (maxYear - minYear)) newDuration = maxYear - minYear;

    let newStart = midPoint - newDuration / 2;
    let newEnd = midPoint + newDuration / 2;

    if (newStart < minYear) { newStart = minYear; newEnd = minYear + newDuration; }
    if (newEnd > maxYear) { newEnd = maxYear; newStart = maxYear - newDuration; }
    
    setViewRange({ start: newStart, end: newEnd });
  };

  const handlePan = (factor) => {
    const { start, end } = viewRange;
    const panAmount = (end - start) * factor;
    
    let newStart = start + panAmount;
    let newEnd = end + panAmount;

    if (newStart < minYear) { newStart = minYear; newEnd = end - (start - minYear); }
    if (newEnd > maxYear) { newEnd = maxYear; newStart = start - (end - maxYear); }

    setViewRange({ start: newStart, end: newEnd });
  };

  const filteredEventIds = useMemo(() => new Set(filteredEvents.map(e => e.id)), [filteredEvents]);
  if (!allEvents || allEvents.length === 0) return null;

  const handleEventClick = (eventId) => {
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 h-20">
      <div className="flex items-center justify-center gap-2 h-full">
        <div className="flex flex-col items-center gap-1">
           <button onClick={() => handleZoom(0.5)} title="Zoom In" className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300"><i className="fa-solid fa-plus"></i></button>
           <button onClick={() => handleZoom(2)} title="Zoom Out" className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300"><i className="fa-solid fa-minus"></i></button>
        </div>
        <button onClick={() => handlePan(-0.25)} title="Pan Left" className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 self-center"><i className="fa-solid fa-chevron-left"></i></button>
        
        <div className="relative w-full pt-8 flex-grow">
          <div className="relative h-2 bg-slate-200 rounded-full">
            {dateMarkers.map(year => {
                const pos = getPosition(year);
                if (pos < 0 || pos > 100) return null;
                return (
                  <div key={year} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${pos}%` }}>
                    <div className="w-px h-4 bg-slate-300"></div>
                    <span className="absolute top-full mt-1 text-xs text-slate-500 -translate-x-1/2">
                      {Math.abs(year) < 10000 ? Math.round(year) : `${(year / 1000).toFixed(0)}k`}
                    </span>
                  </div>
                )
            })}
            {allEvents.map((event) => {
                const pos = getPosition(event.year);
                if (pos < -5 || pos > 105) return null; // Render slightly off-screen for smooth panning
                const isActive = filteredEventIds.has(event.id);
                return (
                  <div key={event.id} data-tooltip-id="event-tooltip" data-tooltip-content={`${event.title} (${event.date})`}
                       className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 border-2 border-white shadow-md ${isActive ? eraConfig[event.era].color : 'bg-slate-300'}`}
                       style={{ left: `${pos}%`, zIndex: isActive ? 10 : 5 }}
                       onClick={() => handleEventClick(event.id)}>
                  </div>
                );
            })}
          </div>
        </div>

        <button onClick={() => handlePan(0.25)} title="Pan Right" className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 self-center"><i className="fa-solid fa-chevron-right"></i></button>
        <button onClick={() => setViewRange({ start: minYear, end: maxYear })} title="Reset View" className="px-2 py-1 self-center rounded bg-slate-200 hover:bg-slate-300"><i className="fa-solid fa-expand"></i></button>
      </div>
      <Tooltip id="event-tooltip" place="top" effect="solid" className="z-50"/>
    </div>
  );
};

export default OverviewTimeline;