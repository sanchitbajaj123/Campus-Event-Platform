import React, { useState, useMemo, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Registration, RegistrationStatus, Event, UserRole, User } from '../types';

const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title: string }> = ({ children, onClose, title }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-neutral-800">{title}</h3>
                        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800">&times;</button>
                    </div>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AddEventForm: React.FC<{ onFormClose: () => void }> = ({ onFormClose }) => {
    const { addEvent, currentUser } = useAppContext();
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        longDescription: '',
        date: '',
        location: '',
        organizer: currentUser?.name || 'Campus Staff',
        imageUrl: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/600/400`,
        maxCapacity: 100,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventData.title || !eventData.date || !eventData.location || !eventData.description || !eventData.longDescription) {
            alert('Please fill out all required fields.');
            return;
        }
        addEvent(eventData);
        onFormClose();
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Event Title</label>
                <input type="text" name="title" id="title" value={eventData.title} onChange={handleChange} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
             <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700">Date and Time</label>
                <input type="datetime-local" name="date" id="date" value={eventData.date} onChange={handleChange} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700">Location</label>
                <input type="text" name="location" id="location" value={eventData.location} onChange={handleChange} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Short Description</label>
                <textarea name="description" id="description" value={eventData.description} onChange={handleChange} rows={2} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
            </div>
             <div className="md:col-span-2">
                <label htmlFor="longDescription" className="block text-sm font-medium text-neutral-700">Long Description</label>
                <textarea name="longDescription" id="longDescription" value={eventData.longDescription} onChange={handleChange} rows={4} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div>
                <label htmlFor="maxCapacity" className="block text-sm font-medium text-neutral-700">Max Capacity</label>
                <input type="number" name="maxCapacity" id="maxCapacity" value={eventData.maxCapacity} onChange={handleChange} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700">Image URL</label>
                <input type="text" name="imageUrl" id="imageUrl" value={eventData.imageUrl} onChange={handleChange} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onFormClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Create Event</button>
            </div>
        </form>
    );
};

const AddOrganizerForm: React.FC<{ onFormClose: () => void }> = ({ onFormClose }) => {
    const { addOrganizer } = useAppContext();
    const [organizerData, setOrganizerData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrganizerData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!organizerData.name || !organizerData.email || !organizerData.password) {
            alert('Please fill out all fields.');
            return;
        }
        const result = addOrganizer(organizerData.name, organizerData.email, organizerData.password);
        if (!result.success) {
            setError(result.message || 'Could not create organizer.');
        } else {
            onFormClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
                <input type="text" name="name" id="name" value={organizerData.name} onChange={handleChange} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                <input type="email" name="email" id="email" value={organizerData.email} onChange={handleChange} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Password</label>
                <input type="password" name="password" id="password" value={organizerData.password} onChange={handleChange} required className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onFormClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Add Organizer</button>
            </div>
        </form>
    );
};

const getStatusBadge = (status: RegistrationStatus) => {
    const styles: {[key in RegistrationStatus]: string} = {
        [RegistrationStatus.PENDING]: "bg-yellow-100 text-yellow-800",
        [RegistrationStatus.APPROVED]: "bg-green-100 text-green-800",
        [RegistrationStatus.REJECTED]: "bg-red-100 text-red-800",
    };
    return <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

const TableWrapper: React.FC<{ children: React.ReactNode, title: string, count: number }> = ({children, title, count}) => (
     <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200/80">
        <h2 className="text-xl font-bold text-neutral-800 mb-4">{title} <span className="text-sm font-medium text-neutral-500">({count})</span></h2>
        <div className="overflow-x-auto">
            {children}
        </div>
    </div>
);

const OrganizerDashboardPage: React.FC = () => {
  const { events, registrations, users, getEventById, getUserById, currentUser, deleteEvent, deleteUser, updateRegistrationStatus } = useAppContext();
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [showAddOrganizerModal, setShowAddOrganizerModal] = useState(false);

  const filteredRegistrations = useMemo(() => {
    if (selectedEventId === 'all') return registrations;
    return registrations.filter(r => r.eventId === parseInt(selectedEventId));
  }, [registrations, selectedEventId]);

  const pendingRegistrations = useMemo(() => filteredRegistrations.filter(r => r.status === RegistrationStatus.PENDING), [filteredRegistrations]);
  const processedRegistrations = useMemo(() => filteredRegistrations.filter(r => r.status !== RegistrationStatus.PENDING).sort((a,b) => b.id - a.id), [filteredRegistrations]);
  
  const RegistrationRow = useCallback(({ registration }: { registration: Registration }) => {
    const user = getUserById(registration.userId);
    const event = getEventById(registration.eventId);

    if (!user || !event) return null;
    
    return (
        <tr className="hover:bg-neutral-50 transition-colors">
            <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{user.name}</td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{event.title}</td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(registration.id).toLocaleDateString()}</td>
            <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onClick={() => updateRegistrationStatus(registration.id, RegistrationStatus.APPROVED)} className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-colors">Approve</button>
                <button onClick={() => updateRegistrationStatus(registration.id, RegistrationStatus.REJECTED)} className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-colors">Reject</button>
            </td>
        </tr>
    );
  }, [getUserById, getEventById, updateRegistrationStatus]);

  const renderTable = (data: any[], head: string[], body: (item: any) => React.ReactNode, noDataMsg: string) => {
      if (data.length === 0) {
          return <p className="text-center text-neutral-500 py-8">{noDataMsg}</p>
      }
      return (
         <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
                <tr>
                    {head.map((h, i) => <th key={i} scope="col" className={`px-5 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider ${h.endsWith("Actions") ? 'text-right' : ''}`}>{h.replace(" Actions", "")}</th>)}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
                {data.map(body)}
            </tbody>
        </table>
      )
  };

  return (
    <div className="space-y-8">
      {showAddEventForm && (
        <Modal onClose={() => setShowAddEventForm(false)} title="Create New Event">
            <AddEventForm onFormClose={() => setShowAddEventForm(false)} />
        </Modal>
      )}
      {showAddOrganizerModal && (
        <Modal onClose={() => setShowAddOrganizerModal(false)} title="Add New Organizer">
            <AddOrganizerForm onFormClose={() => setShowAddOrganizerModal(false)} />
        </Modal>
      )}


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Dashboard</h1>
            <p className="mt-1 text-lg text-neutral-600">Manage campus events, registrations, and users.</p>
        </div>
        <div className="flex items-center gap-4">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm"
            >
              <option value="all">All Events</option>
              {events.map((event: Event) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
        </div>
      </div>
      
      {/* Event Management */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200/80">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neutral-800">Manage Events <span className="text-sm font-medium text-neutral-500">({events.length})</span></h2>
            <button onClick={() => setShowAddEventForm(true)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                + Add Event
            </button>
        </div>
        <div className="overflow-x-auto">
            {renderTable(events, ["Event Title", "Date", "Capacity", "Actions"], (event: Event) => (
                <tr key={event.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{event.title}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(event.date).toLocaleString()}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{registrations.filter(r => r.eventId === event.id && r.status === RegistrationStatus.APPROVED).length} / {event.maxCapacity}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                    </td>
                </tr>
            ), "No events created yet.")}
        </div>
      </div>
      
      {/* Admin: User Management */}
      {currentUser?.role === UserRole.ADMIN && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200/80 space-y-6">
            <h2 className="text-xl font-bold text-neutral-800">User Management</h2>
            
            {/* Organizers Table */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-neutral-700">Organizers <span className="text-sm font-medium text-neutral-500">({users.filter(u => u.role === UserRole.ORGANIZER).length})</span></h3>
                    <button onClick={() => setShowAddOrganizerModal(true)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        + Add Organizer
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {renderTable(
                        users.filter(user => user.role === UserRole.ORGANIZER), 
                        ["Name", "Email", "Actions"], 
                        (user: User) => (
                            <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{user.name}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{user.email}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                                </td>
                            </tr>
                        ), 
                        "No organizers found."
                    )}
                </div>
            </div>

            {/* Students Table */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-4">Students <span className="text-sm font-medium text-neutral-500">({users.filter(u => u.role === UserRole.STUDENT).length})</span></h3>
                <div className="overflow-x-auto">
                     {renderTable(
                        users.filter(user => user.role === UserRole.STUDENT), 
                        ["Name", "Email", "Actions"], 
                        (user: User) => (
                            <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{user.name}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{user.email}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                                </td>
                            </tr>
                        ), 
                        "No students found."
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Admin: All Registrations */}
      {currentUser?.role === UserRole.ADMIN && selectedEventId === 'all' && (
        <TableWrapper title="All Registrations" count={registrations.length}>
          {renderTable(registrations, ["Applicant", "Event", "Status"], (reg: Registration) => {
            const user = getUserById(reg.userId);
            const event = getEventById(reg.eventId);
            return (
                <tr key={reg.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{user?.name || 'Unknown User'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{event?.title || 'Unknown Event'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm">{getStatusBadge(reg.status)}</td>
                </tr>
            );
          }, "No registrations on the platform.")}
        </TableWrapper>
      )}

      {/* Pending Registrations */}
      <TableWrapper title="Pending Approval" count={pendingRegistrations.length}>
          {renderTable(pendingRegistrations, ["Applicant", "Event", "Date", "Actions"], (reg: Registration) => <RegistrationRow key={reg.id} registration={reg} />,"No pending registrations for the selected event(s).")}
      </TableWrapper>

      {/* Processed Registrations */}
      <TableWrapper title="Registration History" count={processedRegistrations.length}>
          {renderTable(processedRegistrations, ["Applicant", "Event", "Status"], (reg: Registration) => {
            const user = getUserById(reg.userId);
            const event = getEventById(reg.eventId);
            return (
                <tr key={reg.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{user?.name || '...'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{event?.title || '...'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500">{getStatusBadge(reg.status)}</td>
                </tr>
            );
          }, "No registration history for the selected event(s).")}
      </TableWrapper>
    </div>
  );
};

export default OrganizerDashboardPage;