import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole, RegistrationStatus } from '../types';

const EventDetailPage: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { 
    getEventById, 
    currentUser,
    registerForEvent, 
    getUserRegistrationStatus,
    getApprovedAttendeeCount 
  } = useAppContext();

  const event = getEventById(eventId);
  
  if (!event) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          &larr; Back to all events
        </Link>
      </div>
    );
  }

  const attendeeCount = getApprovedAttendeeCount(eventId);
  const registrationStatus = getUserRegistrationStatus(eventId, currentUser?._id || currentUser?.id);

  const formattedDate = new Date(event.date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const capacityPercentage = event.maxCapacity > 0 ? (attendeeCount / event.maxCapacity) * 100 : 0;
  
  const renderRegistrationButton = () => {
    if (!currentUser || (currentUser.role !== UserRole.STUDENT && currentUser.role !== 'STUDENT')) {
      return null;
    }
    const baseStyle = "w-full sm:w-auto px-8 py-3 text-base font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const disabledStyle = "cursor-not-allowed opacity-70";

    if (registrationStatus === RegistrationStatus.PENDING) {
      return <button disabled className={`${baseStyle} bg-yellow-500 text-white ${disabledStyle}`}>Registration Pending</button>;
    }
    if (registrationStatus === RegistrationStatus.APPROVED) {
      return <button disabled className={`${baseStyle} bg-green-500 text-white ${disabledStyle}`}>Registered</button>;
    }
    if (registrationStatus === RegistrationStatus.REJECTED) {
      return <button disabled className={`${baseStyle} bg-red-500 text-white ${disabledStyle}`}>Registration Rejected</button>;
    }

    if (attendeeCount >= event.maxCapacity) {
      return <button disabled className={`${baseStyle} bg-neutral-400 text-white ${disabledStyle}`}>Event Full</button>;
    }

    return (
      <button 
        onClick={() => registerForEvent(event._id || event.id)}
        className={`${baseStyle} text-white bg-primary hover:bg-primary-light focus:ring-primary transform hover:scale-105`}
      >
        Register for this Event
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200/80 overflow-hidden">
        <img className="h-56 sm:h-72 md:h-96 w-full object-cover" src={event.imageUrl} alt={event.title} />
        <div className="p-6 sm:p-8 md:p-10">
          <div className="md:flex justify-between items-start">
            <div className='flex-grow'>
                <p className="uppercase tracking-wide text-sm text-primary font-semibold">{event.organizer}</p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">{event.title}</h1>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-neutral-600">
                    <p className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {formattedDate}</p>
                    <p className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {event.location}</p>
                </div>
            </div>
             <div className="mt-4 md:mt-0 flex justify-end">
                {renderRegistrationButton()}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-800">About this event</h3>
            <p className="mt-4 text-neutral-600 leading-relaxed prose">{event.longDescription}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-800">Capacity</h3>
            <div className="flex items-center mt-4">
                <span className="mr-4 font-semibold text-neutral-800 whitespace-nowrap">{attendeeCount} / {event.maxCapacity}</span>
                <div className="w-full bg-neutral-200 rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: `${capacityPercentage}%` }}></div>
                </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-neutral-200 flex justify-end">
            <Link to="/" className="font-medium text-primary hover:text-primary-dark transition-colors">
                &larr; Back to All Events
            </Link>
          </div>
        </div>
      </div>
  );
};

export default EventDetailPage;