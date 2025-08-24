import React from 'react';
import { motion as Motion } from 'framer-motion'; // Reverted to the specified alias

const eraConfig = {
    "Ancient History": { gradient: "from-amber-500 to-yellow-400", shadow: "shadow-amber-500/30", marker: "bg-amber-500" },
    "Classical Antiquity": { gradient: "from-lime-500 to-green-400", shadow: "shadow-lime-500/30", marker: "bg-lime-500" },
    "Post-Classical History": { gradient: "from-cyan-500 to-sky-400", shadow: "shadow-cyan-500/30", marker: "bg-cyan-500" },
    "Modern History": { gradient: "from-fuchsia-500 to-purple-500", shadow: "shadow-fuchsia-500/30", marker: "bg-fuchsia-500" },
    "Contemporary History": { gradient: "from-rose-500 to-red-500", shadow: "shadow-rose-500/30", marker: "bg-rose-500" },
};

const Timeline = ({ events }) => {

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-20">
                <i className="fa-solid fa-search text-5xl text-slate-400 mb-4"></i>
                <h2 className="text-3xl font-bold text-slate-700">No Events Found</h2>
                <p className="text-slate-500 mt-2">Try adjusting your search or filter settings.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="relative wrap overflow-hidden p-2 md:p-10 h-full">
                <div className="absolute border-2-2 border-slate-300 h-full border hidden md:block" style={{ left: '50%' }}></div>

                {events.map((item, index) => {
                    const isRight = index % 2 === 0;
                    const config = eraConfig[item.era];

                    const cardVariants = {
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    };
                    
                    return (
                        // Reverted to use Motion.div
                        <Motion.div
                            id={`event-${item.id}`}
                            className={`mb-8 flex md:justify-between items-center w-full ${isRight ? 'md:flex-row-reverse' : ''}`}
                            key={item.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                        >
                            <div className="hidden md:block w-5/12"></div>
                            <div className={`z-20 hidden md:flex items-center order-1 w-5 h-5 rounded-full ${config.marker}`}></div>
                            
                            <div className="order-1 w-full md:w-5/12 px-1 py-4">
                                <div className="rounded-xl shadow-2xl bg-white border border-slate-200 overflow-hidden transform transition-transform hover:-translate-y-1">
                                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-full text-white text-xl flex items-center justify-center bg-gradient-to-br ${config.gradient}`}>
                                                <i className={item.icon}></i>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-2xl">{item.title}</h3>
                                                <p className="text-xs text-slate-400 font-semibold">{item.era}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm leading-snug tracking-wide text-slate-500 font-semibold mb-4 bg-slate-100 p-2 rounded-md">
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