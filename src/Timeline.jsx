// src/Timeline.jsx

import React from 'react';
import { motion as Motion } from 'framer-motion';
import { historicalEvents } from './data';

const eraConfig = {
    "Ancient History": {
        gradient: "from-amber-500 to-yellow-400",
        shadow: "shadow-amber-500/30",
        marker: "bg-amber-500"
    },
    "Classical Antiquity": {
        gradient: "from-lime-500 to-green-400",
        shadow: "shadow-lime-500/30",
        marker: "bg-lime-500"
    },
    "Post-Classical History": {
        gradient: "from-cyan-500 to-sky-400",
        shadow: "shadow-cyan-500/30",
        marker: "bg-cyan-500"
    },
    "Modern History": {
        gradient: "from-fuchsia-500 to-purple-500",
        shadow: "shadow-fuchsia-500/30",
        marker: "bg-fuchsia-500"
    },
    "Contemporary History": {
        gradient: "from-rose-500 to-red-500",
        shadow: "shadow-rose-500/30",
        marker: "bg-rose-500"
    },
};

const Timeline = () => {
    const yearMarkers = [];
    for (let year = -10000; year <= 2000; year += 1000) {
        yearMarkers.push({ type: 'marker', year, id: `marker-${year}` });
    }

    const timelineItems = [...historicalEvents, ...yearMarkers].sort((a, b) => a.year - b.year);

    let eventIndex = -1; // Use a separate counter for event card alignment

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="relative wrap overflow-hidden p-10 h-full">
                {/* Central Line */}
                <div className="absolute border-2-2 border-slate-300 h-full border" style={{ left: '50%' }}></div>

                {timelineItems.map((item) => {
                    if (item.type === 'marker') {
                        return (
                            <div key={item.id} className="mb-8 flex justify-center items-center w-full relative">
                                <div className="z-10 bg-slate-400 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                                     {item.year === 0 ? '1 CE' : `${Math.abs(item.year)} ${item.year < 0 ? 'BCE' : 'CE'}`}
                                </div>
                            </div>
                        );
                    }
                    
                    // This is an event card, increment the index
                    eventIndex++;
                    const isRight = eventIndex % 2 === 0;
                    const config = eraConfig[item.era];

                    const cardVariants = {
                        hidden: { opacity: 0, x: isRight ? 100 : -100 },
                        visible: {
                            opacity: 1, x: 0,
                            transition: { duration: 0.6, ease: "easeOut" }
                        }
                    };
                    
                    return (
                        <Motion.div
                            id={`event-${item.id}`}
                            className={`mb-8 flex justify-between items-center w-full ${isRight ? 'flex-row-reverse' : ''}`}
                            key={item.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={cardVariants}
                        >
                            <div className="order-1 w-5/12"></div>
                            <div className={`z-20 flex items-center order-1 w-5 h-5 rounded-full ${config.marker}`}></div>
                            <div className="order-1 w-5/12 px-1">
                                <div className="rounded-lg shadow-2xl bg-white border border-slate-200 overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                                    <div className="p-6">
                                        <h3 className="mb-2 font-bold text-slate-800 text-2xl">{item.title}</h3>
                                        <p className="text-sm leading-snug tracking-wide text-slate-500 font-semibold mb-3">
                                            <i className="fa-solid fa-calendar-days mr-2"></i>{item.date} | <i className="fa-solid fa-location-dot ml-2 mr-2"></i>{item.location}
                                        </p>
                                        <p className="text-md leading-relaxed text-slate-600">
                                            {item.description}
                                        </p>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-block mt-5 px-6 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-r ${config.gradient} transition-all duration-300 hover:scale-105 hover:shadow-xl ${config.shadow}`}
                                        >
                                            Read More <i className="fa-solid fa-arrow-right ml-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Timeline;
