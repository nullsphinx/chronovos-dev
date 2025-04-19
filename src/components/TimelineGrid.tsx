import { motion, AnimatePresence } from 'framer-motion';
import { TimelineEvent, REGIONS, START_YEAR, TOTAL_YEARS } from '../data/events';
import { useState, useCallback } from 'react';

interface TimelineGridProps {
  events: TimelineEvent[];
}

interface PlacedEvent extends TimelineEvent {
  position: number; // Position in row (0 to n-1)
  totalInRow: number; // Total events in this row
}

interface MousePosition {
  x: number;
  y: number;
}

const getEventColors = (tags: string[]) => {
  // Base colors for event types
  if (tags.includes("War") || tags.includes("Military Campaign")) {
    return {
      bg: "bg-red-900/40",
      hoverBg: "group-hover:bg-red-800/60",
      text: "text-red-50",
    };
  }
  if (tags.includes("Economic") || tags.includes("Trade & Commerce")) {
    return {
      bg: "bg-emerald-900/40",
      hoverBg: "group-hover:bg-emerald-800/60",
      text: "text-emerald-50",
    };
  }
  if (tags.includes("Cultural") || tags.includes("Social Structure")) {
    return {
      bg: "bg-blue-900/40",
      hoverBg: "group-hover:bg-blue-800/60",
      text: "text-blue-50",
    };
  }
  // Default political events
  return {
    bg: "bg-primary-900/40",
    hoverBg: "group-hover:bg-primary-800/60",
    text: "text-primary-50",
  };
};

const getEventImportance = (ev: TimelineEvent) => {
  // Calculate importance based on duration and tags
  const duration = ev.endYear - ev.startYear;
  const hasMajorTags = ev.tags.some(tag => 
    ["Revolution", "War", "Empire", "Political"].includes(tag)
  );
  return duration > 10 || hasMajorTags;
};

// Reduced from 32 to 24 pixels
const ROW_HEIGHT = 24;

export function TimelineGrid({ events }: TimelineGridProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  // Get unique regions from the provided events
  const uniqueRegions = Array.from(new Set(events.map(e => e.region)));
  const isSingleRegion = uniqueRegions.length === 1;

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
    setHoveredEvent(null);
  }, []);

  const placed: PlacedEvent[] = [];
  
  // Modified event placement logic for single region
  const regionsToProcess = isSingleRegion ? uniqueRegions : REGIONS;
  
  regionsToProcess.forEach((reg) => {
    const regionEvents = events
      .filter((e) => e.region === reg)
      .sort((a, b) => a.startYear - b.startYear || a.startYear - b.startYear);

    // First, identify all unique year ranges where events exist
    const yearRanges = new Set<number>();
    regionEvents.forEach(event => {
      for (let year = event.startYear; year <= event.endYear; year++) {
        yearRanges.add(year);
      }
    });

    // For each year, determine events present and their order
    Array.from(yearRanges).forEach(year => {
      // Find all events present in this year
      const eventsInYear = regionEvents.filter(event => 
        event.startYear <= year && event.endYear >= year
      );

      // Sort events within the year by their start date and then by their end date
      eventsInYear.sort((a, b) => {
        if (a.startYear !== b.startYear) return a.startYear - b.startYear;
        return a.endYear - b.endYear;
      });

      // Update or create placed events with their position in this year
      eventsInYear.forEach((event, index) => {
        const existingPlaced = placed.find(p => p.id === event.id);
        if (existingPlaced) {
          // Update if the new row has more events
          if (eventsInYear.length > existingPlaced.totalInRow) {
            existingPlaced.position = index;
            existingPlaced.totalInRow = eventsInYear.length;
          }
        } else {
          placed.push({
            ...event,
            position: index,
            totalInRow: eventsInYear.length
          });
        }
      });
    });
  });

  const years = Array.from({ length: TOTAL_YEARS }, (_, i) => START_YEAR + i);

  return (
    <div className="relative w-full">
      {/* Sticky Headers */}
      <div className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="h-10 flex">
          <div className="w-20 flex-shrink-0 px-4 flex items-center border-r border-neutral-800">
            <span className="font-medium text-neutral-100 text-sm">Year</span>
          </div>
          <div className={`flex-1 ${isSingleRegion ? '' : 'grid grid-cols-4'}`}>
            {regionsToProcess.map((region, index) => (
              <div
                key={region}
                className={`px-4 py-1.5 font-medium text-neutral-100 text-sm flex items-center justify-center border-r border-neutral-800 ${
                  index === regionsToProcess.length - 1 ? 'border-r-0' : ''
                }`}
              >
                {region}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative min-w-[1000px]">
        {/* Fixed Year Scale */}
        <div className="absolute left-0 top-0 w-20 bg-neutral-900 z-20">
          {years.map((year) => (
            <div
              key={year}
              className={`h-6 flex flex-col justify-center items-center px-2 ${
                year % 5 === 0 
                  ? `font-medium text-neutral-${year % 10 === 0 ? '200' : '400'}`
                  : 'text-transparent'
              }`}
              style={{ height: `${ROW_HEIGHT}px` }}
            >
              <span className="text-xs leading-none">{Math.abs(year)}</span>
              <span className="text-[10px] leading-none mt-0.5 opacity-75">
                {year < 0 ? 'BCE' : 'CE'}
              </span>
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {years.map((year) => (
            <div
              key={year}
              className={`border-b ${
                year % 10 === 0
                  ? 'border-neutral-700'
                  : year % 5 === 0
                  ? 'border-neutral-800/70'
                  : 'border-neutral-800/20'
              }`}
              style={{ height: `${ROW_HEIGHT}px` }}
            />
          ))}
        </div>

        {/* Events Grid */}
        <div
          className={`relative ${isSingleRegion ? '' : 'grid grid-cols-4'}`}
          style={{ marginLeft: '80px', height: `${years.length * ROW_HEIGHT}px` }}
        >
          {regionsToProcess.map((region, index) => (
            <div
              key={region}
              className={`relative ${
                !isSingleRegion && index < regionsToProcess.length - 1 ? 'border-r border-neutral-800' : ''
              }`}
            >
              {/* Region Guide Line */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background: `linear-gradient(to bottom, ${
                    region === 'Europe'
                      ? 'rgba(59, 130, 246, 0.1)'
                      : region === 'Africa & Middle East'
                      ? 'rgba(239, 68, 68, 0.1)'
                      : region === 'Asia Pacific'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(139, 92, 246, 0.1)'
                  }, transparent)`,
                }}
              />

              {/* Events */}
              {placed
                .filter((ev) => ev.region === region)
                .map((ev) => {
                  const colors = getEventColors(ev.tags);
                  const isImportant = getEventImportance(ev);
                  
                  const startOffset = ev.startYear - Math.floor(ev.startYear);
                  const endOffset = ev.endYear - Math.floor(ev.endYear);
                  const top = ((ev.startYear - START_YEAR) * ROW_HEIGHT) + (startOffset * ROW_HEIGHT);
                  const height = ((ev.endYear - ev.startYear) * ROW_HEIGHT) + ((endOffset - startOffset) * ROW_HEIGHT);
                  const padding = isSingleRegion ? 5 : 10;
                  const availableWidth = (100 - padding);
                  const width = availableWidth / ev.totalInRow;
                  const left = (padding / 2) + (ev.position * width);

                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`group absolute rounded-lg cursor-pointer ${colors.bg} ${colors.text} transition-all duration-200`}
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height - 1, ROW_HEIGHT/2)}px`,
                        width: `${width}%`,
                        left: `${left}%`,
                      }}
                      onMouseMove={(e) => {
                        handleMouseMove(e);
                        setHoveredEvent(ev.id.toString());
                      }}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Default View - Just Title */}
                      <div className={`h-full px-2 py-1 flex items-center ${colors.bg} ${colors.hoverBg} transition-colors duration-200 rounded-lg`}>
                        <div className={`truncate font-medium ${isImportant ? 'text-base' : 'text-sm'}`}>
                          {ev.name}
                        </div>
                      </div>

                      {/* Hover View - Expanded Details */}
                      <AnimatePresence>
                        {mousePosition && hoveredEvent === ev.id.toString() && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="fixed bg-neutral-800 p-3 rounded-lg shadow-xl border border-neutral-700 z-50"
                            style={{
                              position: 'fixed',
                              left: mousePosition.x,
                              top: mousePosition.y,
                              transform: 'translate(10px, 10px)',
                              pointerEvents: 'none',
                              minWidth: '200px',
                              maxWidth: '300px'
                            }}
                          >
                            <div className="font-semibold mb-1">{ev.name}</div>
                            <div className="text-sm text-neutral-300 mb-2">
                              {ev.startYear < 0 ? Math.abs(ev.startYear) + ' BCE' : ev.startYear + ' CE'} - {ev.endYear < 0 ? Math.abs(ev.endYear) + ' BCE' : ev.endYear + ' CE'}
                            </div>
                            <div className="text-sm text-neutral-400 mb-2">{ev.description}</div>
                            <div className="flex flex-wrap gap-1">
                              {ev.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-1.5 py-0.5 rounded-full bg-neutral-700 text-neutral-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 