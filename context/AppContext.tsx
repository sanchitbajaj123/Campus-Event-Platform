import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Event, Registration, UserRole, RegistrationStatus } from '../types';


interface AppContextType {
  currentUser: User | null;
  users: User[];
  events: Event[];
  registrations: Registration[];
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  signUp: (name: string, email: string, password?: string) => { success: boolean, message?: string };
  addOrganizer: (name: string, email: string, password?: string) => { success: boolean, message?: string };
  switchUser: (userId: number) => void;
  addEvent: (eventData: Omit<Event, 'id'>) => void;
  deleteEvent: (eventId: number) => void;
  deleteUser: (userId: number) => void;
  registerForEvent: (eventId: number) => void;
  updateRegistrationStatus: (registrationId: number, status: RegistrationStatus) => void;
  getEventById: (eventId: number) => Event | undefined;
  getUserById: (userId: number) => User | undefined;
  getRegistrationsForEvent: (eventId: number) => Registration[];
  getApprovedAttendeeCount: (eventId: number) => number;
  getUserRegistrationStatus: (eventId: number, userId: number | undefined) => RegistrationStatus | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


const USERS_STORAGE_KEY = 'campus_events_users';
const EVENTS_STORAGE_KEY = 'campus_events_events';
const REGISTRATIONS_STORAGE_KEY = 'campus_events_registrations';


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);



  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);


  useEffect(() => {
    fetch('http://localhost:5000/api/users').then(res => res.json()).then(setUsers);
    fetch('http://localhost:5000/api/events').then(res => res.json()).then(setEvents);
    fetch('http://localhost:5000/api/registrations').then(res => res.json()).then(setRegistrations);
  }, []);



  const refreshAll = useCallback(() => {
    fetch('http://localhost:5000/api/users').then(res => res.json()).then(setUsers);
    fetch('http://localhost:5000/api/events').then(res => res.json()).then(setEvents);
    fetch('http://localhost:5000/api/registrations').then(res => res.json()).then(setRegistrations);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      const studentUsers = users.filter(u => u.role === UserRole.STUDENT);
      if (studentUsers.length === 0 || events.length === 0) return;
      
      const randomStudent = studentUsers[Math.floor(Math.random() * studentUsers.length)];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      const alreadyRegistered = registrations.some(
        r => r.eventId === randomEvent.id && r.userId === randomStudent.id
      );

      const approvedCount = registrations.filter(r => r.eventId === randomEvent.id && r.status === RegistrationStatus.APPROVED).length;

      if (!alreadyRegistered && approvedCount < randomEvent.maxCapacity) {
        setRegistrations(prev => [
          ...prev,
          {
            id: Date.now(),
            eventId: randomEvent.id,
            userId: randomStudent.id,
            status: RegistrationStatus.PENDING,
          },
        ]);
      }
  }, 5000);

    return () => clearInterval(interval);
  }, [users, events.length, registrations]);


  const login = useCallback(async (email: string, password?: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return false;
      const user = await res.json();
  setCurrentUser(user);
  localStorage.setItem('lastLoggedInUser', JSON.stringify(user));
  console.log('Logged in user:', user);
      return true;
    } catch {
      return false;
    }
  }, []);
  
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);


  const signUp = useCallback(async (name: string, email: string, password?: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        let errMsg = 'Signup failed';
        try {
          const err = await res.json();
          if (err.error && err.error.includes('duplicate key')) {
            errMsg = 'Email is already registered.';
          } else if (err.error) {
            errMsg = err.error;
          }
        } catch {}
        return { success: false, message: errMsg };
      }
      const user = await res.json();
      setCurrentUser(user);
      refreshAll();
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Signup failed' };
    }
  }, [refreshAll]);


  const addOrganizer = useCallback(async (name: string, email: string, password?: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'ORGANIZER' })
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.error };
      }
      refreshAll();
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Add organizer failed' };
    }
  }, [refreshAll]);


  const switchUser = useCallback((userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  }, [users]);


  const addEvent = useCallback(async (eventData: Omit<Event, 'id'>) => {
    await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    refreshAll();
  }, [refreshAll]);


  const deleteEvent = useCallback(async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This will also remove all associated registrations.')) {
      await fetch(`http://localhost:5000/api/events/${eventId}`, { method: 'DELETE' });
      refreshAll();
    }
  }, [refreshAll]);


  const deleteUser = useCallback(async (userId: string) => {
    if (userId === currentUser?._id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this user? This will remove them and all their event registrations.')) {
      await fetch(`http://localhost:5000/api/users/${userId}`, { method: 'DELETE' });
      refreshAll();
    }
  }, [currentUser, refreshAll]);


  const registerForEvent = async (eventId: string) => {
    if (!currentUser) {
      alert("You must be logged in to register for an event.");
      return;
    }
    const alreadyRegistered = registrations.some(
      r => r.eventId === eventId && r.userId === currentUser._id
    );
    if (alreadyRegistered) {
      alert("You are already registered or your registration is pending.");
      return;
    }
    await fetch('http://localhost:5000/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, userId: currentUser._id, status: 'PENDING' })
    });
    refreshAll();
  };


  const updateRegistrationStatus = async (registrationId: string, status: RegistrationStatus) => {
    await fetch(`http://localhost:5000/api/registrations/${registrationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    refreshAll();
  };


  const getEventById = useCallback((eventId: string) => {
    return events.find(e => e._id === eventId);
  }, [events]);

  const getUserById = useCallback((userId: string) => {
    return users.find(u => u._id === userId);
  }, [users]);

  const getRegistrationsForEvent = useCallback((eventId: string) => {
    return registrations.filter(r => r.eventId === eventId);
  }, [registrations]);

  const getApprovedAttendeeCount = useCallback((eventId: string) => {
    return registrations.filter(r => r.eventId === eventId && r.status === RegistrationStatus.APPROVED).length;
  }, [registrations]);

  const getUserRegistrationStatus = useCallback((eventId: string, userId: string | undefined) => {
    if (!userId) return null;
    const registration = registrations.find(r => r.eventId === eventId && r.userId === userId);
    return registration ? registration.status : null;
  }, [registrations]);

  const value = {
    currentUser,
    users,
    events,
    registrations,
    login,
    logout,
    signUp,
    addOrganizer,
    switchUser,
    addEvent,
    deleteEvent,
    deleteUser,
    registerForEvent,
    updateRegistrationStatus,
    getEventById,
    getUserById,
    getRegistrationsForEvent,
    getApprovedAttendeeCount,
    getUserRegistrationStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};