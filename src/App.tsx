import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useRef } from 'react';
import { TimelineGrid } from './components/TimelineGrid';
import Navbar from './components/Navbar';
import RegionPage from './pages/RegionPage';
import { TagFilterMenu } from './components/TagFilterMenu';
import { TimelineMinimap } from './components/TimelineMinimap';
import { EVENTS } from './data/events';
import { TAG_HIERARCHY } from './data/tags';
import './App.css';

export default function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const getAllChildTags = (tag: string): string[] => {
    const findChildren = (tagName: string): string[] => {
      const node = TAG_HIERARCHY.find(t => t.name === tagName);
      if (!node || !node.children) return [tagName];
      return [tagName, ...node.children.map(child => findChildren(child.name)).flat()];
    };
    return findChildren(tag);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const filteredEvents = selectedTags.length > 0
    ? EVENTS.filter(event =>
        event.tags.some(tag =>
          selectedTags.some(selectedTag =>
            getAllChildTags(selectedTag).includes(tag)
          )
        )
      )
    : EVENTS;

  return (
    <Router>
      <div className="flex flex-col h-screen bg-neutral-900">
        <Navbar />
        <Routes>
          <Route path="/region/:region" element={<RegionPage events={EVENTS} />} />
          <Route
            path="/"
            element={
              <div className="flex flex-1 overflow-hidden">
                <div className="w-[120px] flex-shrink-0 border-r border-neutral-800">
                  <TagFilterMenu
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                  />
                </div>
                <div className="flex-1 flex overflow-hidden">
                  <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden">
                    <TimelineGrid
                      events={filteredEvents}
                    />
                  </div>
                  <div className="w-[120px] flex flex-col flex-shrink-0 border-l border-neutral-800">
                    <div className="flex gap-2 p-2 bg-neutral-900 border-b border-neutral-800">
                      <button
                        onClick={scrollToTop}
                        className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors shadow-lg"
                        title="Scroll to top"
                      >
                        <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </button>
                      <button
                        onClick={scrollToBottom}
                        className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors shadow-lg"
                        title="Scroll to bottom"
                      >
                        <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>
                    </div>
                    <TimelineMinimap
                      events={filteredEvents}
                      scrollContainer={scrollContainerRef.current}
                    />
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
