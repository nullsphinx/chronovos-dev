import { TimelineEvent, START_YEAR, TOTAL_YEARS, REGIONS } from '../data/events';
import { useEffect, useRef } from 'react';

interface TimelineMinimapProps {
  events: TimelineEvent[];
  scrollContainer: HTMLDivElement | null;
}

export function TimelineMinimap({ events, scrollContainer }: TimelineMinimapProps) {
  const MINIMAP_WIDTH = 120;
  const ROW_HEIGHT = 2; // Scaled down from the main grid's row height
  const minimapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollContainer || !minimapRef.current) return;

    const handleScroll = () => {
      const scrollPercentage = scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight);
      const minimapScrollTop = scrollPercentage * (minimapRef.current!.scrollHeight - minimapRef.current!.clientHeight);
      minimapRef.current!.scrollTop = minimapScrollTop;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
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
    <div className="w-[120px] bg-neutral-900/80 backdrop-blur-sm border-l border-neutral-800 h-[calc(100vh-4rem)] overflow-hidden">
      <div 
        ref={minimapRef}
        className="relative w-full h-full overflow-hidden"
        style={{ height: '100%' }}
      >
        {/* Grid Container */}
        <div 
          className={`relative ${isSingleRegion ? '' : 'grid grid-cols-4'}`}
          style={{ 
            marginLeft: '12px', 
            width: `${MINIMAP_WIDTH - 12}px`,
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