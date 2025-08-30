import React from 'react';
import EventCard from '../components/EventCard';
import { useAppContext } from '../context/AppContext';

const EventsListPage: React.FC = () => {
  const { events } = useAppContext();

  return (
    <div className="space-y-10">
        <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Upcoming Campus Events
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600">
                Discover, engage, and be part of our vibrant campus community.
            </p>
        </div>
        {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                    <EventCard key={event._id || event.id} event={event} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-neutral-200/80">
                <h3 className="text-xl font-semibold text-neutral-800">No Events Found</h3>
                <p className="mt-2 text-neutral-500">Check back soon for new and exciting events!</p>
            </div>
        )}
    </div>
  );
};

export default EventsListPage;