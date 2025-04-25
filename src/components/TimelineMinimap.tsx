import { TimelineEvent, START_YEAR, TOTAL_YEARS, REGIONS } from '../data/events';
import { useEffect, useRef, useState } from 'react';

interface TimelineMinimapProps {
  events: TimelineEvent[];
  scrollContainer: HTMLDivElement | null;
}

export function TimelineMinimap({ events, scrollContainer }: TimelineMinimapProps) {
  const [viewportHeight, setViewportHeight] = useState(0);
  const minimapRef = useRef<HTMLDivElement>(null);
  const ROW_HEIGHT = 1.5; // Reduced from 2px for better density

  useEffect(() => {
    if (!scrollContainer || !minimapRef.current) return;

    const updateViewportHeight = () => {
      const containerHeight = scrollContainer.clientHeight;
      const totalHeight = scrollContainer.scrollHeight;
      const minimapHeight = minimapRef.current!.scrollHeight;
      const newViewportHeight = (containerHeight / totalHeight) * minimapHeight;
      setViewportHeight(newViewportHeight);
    };

    const handleScroll = () => {
      const scrollPercentage = scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight);
      const minimapScrollTop = scrollPercentage * (minimapRef.current!.scrollHeight - minimapRef.current!.clientHeight);
      minimapRef.current!.scrollTop = minimapScrollTop;
    };

    const resizeObserver = new ResizeObserver(() => {
      updateViewportHeight();
    });

    resizeObserver.observe(scrollContainer);
    scrollContainer.addEventListener('scroll', handleScroll);
    
    // Initial update
    updateViewportHeight();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [scrollContainer]);

  const getEventColors = (tags: string[]) => {
    if (tags.includes("War") || tags.includes("Military Campaign")) {
      return "bg-red-900/40";
    }
    if (tags.includes("Economic") || tags.includes("Trade & Commerce")) {
      return "bg-emerald-900/40";
    }
    if (tags.includes("Cultural") || tags.includes("Social Structure")) {
      return "bg-blue-900/40";
    }
    return "bg-primary-900/40";
  };

  const years = Array.from({ length: TOTAL_YEARS }, (_, i) => START_YEAR + i);
  const uniqueRegions = Array.from(new Set(events.map(e => e.region)));
  const isSingleRegion = uniqueRegions.length === 1;
  const regionsToProcess = isSingleRegion ? uniqueRegions : REGIONS;

  return (
    <div className="w-24 md:w-32 lg:w-40 bg-neutral-900/80 backdrop-blur-sm border-l border-neutral-800 h-[calc(100vh-4rem)] overflow-hidden">
      <div 
        ref={minimapRef}
        className="relative w-full h-full overflow-hidden"
      >
        {/* Viewport Indicator */}
        <div 
          className="absolute w-full bg-neutral-700/20 border border-neutral-600/30"
          style={{ height: `${viewportHeight}px` }}
        />

        {/* Grid Container */}
        <div 
          className={`relative ${isSingleRegion ? '' : 'grid grid-cols-4'}`}
          style={{ 
            marginLeft: '8px',
            height: `${years.length * ROW_HEIGHT}px`
          }}
        >
          {/* Region Columns */}
          {regionsToProcess.map((region, index) => (
            <div
              key={region}
              className={`relative ${
                !isSingleRegion && index < regionsToProcess.length - 1 ? 'border-r border-neutral-800/30' : ''
              }`}
            >
              {/* Events */}
              {events
                .filter(ev => ev.region === region)
                .map(ev => {
                  const top = (ev.startYear - START_YEAR) * ROW_HEIGHT;
                  const height = Math.max((ev.endYear - ev.startYear) * ROW_HEIGHT, 1);
                  const color = getEventColors(ev.tags);
                  
                  return (
                    <div
                      key={ev.id}
                      className={`absolute ${color} rounded-sm`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: '1px',
                        right: '1px',
                      }}
                    />
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 