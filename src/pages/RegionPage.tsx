import { useParams } from 'react-router-dom';
import { TimelineGrid } from '../components/TimelineGrid';
import { TimelineEvent } from '../data/events';

interface RegionPageProps {
  events: TimelineEvent[];
}

export default function RegionPage({ events }: RegionPageProps) {
  const { regionId } = useParams();
  const region = regionId?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  // Filter events for the specific region
  const regionEvents = events.filter(event => 
    event.region.toLowerCase() === region?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-neutral-100 mb-8">{region}</h1>
        <TimelineGrid 
          events={regionEvents}
        />
      </div>
    </div>
  );
} 