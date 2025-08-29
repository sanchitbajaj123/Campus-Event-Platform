import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { useAppContext } from '../context/AppContext';

interface EventCardProps {
  event: Event;
}

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { getApprovedAttendeeCount } = useAppContext();
    const attendeeCount = getApprovedAttendeeCount(event.id);
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

  return (
    <Link to={`/event/${event.id}`} className="block group bg-white rounded-xl shadow-sm border border-neutral-200/80 overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
        <div className="flex flex-col h-full">
            <div className="relative overflow-hidden">
                <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" src={event.imageUrl} alt={event.title} />
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full flex items-center space-x-2 shadow-md">
                    <UsersIcon />
                    <span className="font-bold text-primary text-sm">{attendeeCount}</span>
                    <span className="text-neutral-500 text-sm">/ {event.maxCapacity}</span>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-sm font-medium text-primary">{event.organizer}</p>
                <h3 className="mt-1 text-lg font-bold text-neutral-900 leading-tight">{event.title}</h3>
                <p className="mt-2 text-neutral-600 text-sm flex-grow">{event.description}</p>
                <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col space-y-2 text-sm">
                    <div className="flex items-center text-neutral-700">
                        <CalendarIcon />
                        <span>{formattedDate} &bull; {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit'})}</span>
                    </div>
                    <div className="flex items-center text-neutral-700">
                        <LocationIcon />
                        <span>{event.location}</span>
                    </div>
                </div>
            </div>
        </div>
    </Link>
  );
};

export default EventCard;