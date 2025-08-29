import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Event, Registration, UserRole, RegistrationStatus } from '../types';
import { USERS, EVENTS } from '../constants';

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

// LocalStorage Keys
const USERS_STORAGE_KEY = 'campus_events_users';
const EVENTS_STORAGE_KEY = 'campus_events_events';
const REGISTRATIONS_STORAGE_KEY = 'campus_events_registrations';


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Lazy initialize state from localStorage or use default constants
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
      return savedUsers ? JSON.parse(savedUsers) : USERS;
    } catch (error) {
      console.error("Error reading users from localStorage", error);
      return USERS;
    }
  });

  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const savedEvents = window.localStorage.getItem(EVENTS_STORAGE_KEY);
      const parsedEvents = savedEvents ? JSON.parse(savedEvents) : EVENTS;
      return parsedEvents.sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error("Error reading events from localStorage", error);
      return EVENTS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const savedRegistrations = window.localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
      // If no registrations are saved, create some initial ones for demonstration
      if (savedRegistrations) {
        return JSON.parse(savedRegistrations);
      }
      return [
        { id: 1, eventId: 1, userId: 2, status: RegistrationStatus.APPROVED },
        { id: 2, eventId: 1, userId: 3, status: RegistrationStatus.PENDING },
        { id: 3, eventId: 2, userId: 2, status: RegistrationStatus.APPROVED },
      ];
    } catch (error) {
      console.error("Error reading registrations from localStorage", error);
      return [];
    }
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    window.localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
  }, [registrations]);

  // Simulate real-time new registrations
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
    }, 5000); // New registration every 5 seconds

    return () => clearInterval(interval);
  }, [users, events.length, registrations]);

  const login = useCallback((email: string, password?: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);
  
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const signUp = useCallback((name: string, email: string, password?: string) => {
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password,
      role: UserRole.STUDENT,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  }, [users]);

  const addOrganizer = useCallback((name: string, email: string, password?: string) => {
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    const newOrganizer: User = {
      id: Date.now(),
      name,
      email,
      password,
      role: UserRole.ORGANIZER,
    };
    setUsers(prev => [...prev, newOrganizer]);
    return { success: true };
  }, [users]);


  const switchUser = useCallback((userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  }, [users]);

  const addEvent = useCallback((eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: Date.now(),
      ...eventData,
      maxCapacity: Number(eventData.maxCapacity),
    };
    setEvents(prev => [...prev, newEvent].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, []);

  const deleteEvent = useCallback((eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event? This will also remove all associated registrations.')) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setRegistrations(prev => prev.filter(r => r.eventId !== eventId));
    }
  }, []);

  const deleteUser = useCallback((userId: number) => {
    if (userId === currentUser?.id) {
        alert("You cannot delete your own account.");
        return;
    }
    if (window.confirm('Are you sure you want to delete this user? This will remove them and all their event registrations.')) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setRegistrations(prev => prev.filter(r => r.userId !== userId));
    }
  }, [currentUser]);

  const registerForEvent = (eventId: number) => {
    if (!currentUser) {
        alert("You must be logged in to register for an event.");
        return;
    }
    const alreadyRegistered = registrations.some(
      r => r.eventId === eventId && r.userId === currentUser.id
    );
    if (alreadyRegistered) {
      alert("You are already registered or your registration is pending.");
      return;
    }
    setRegistrations(prev => [
      ...prev,
      {
        id: Date.now(),
        eventId,
        userId: currentUser.id,
        status: RegistrationStatus.PENDING,
      },
    ]);
  };

  const updateRegistrationStatus = (registrationId: number, status: RegistrationStatus) => {
    setRegistrations(prev =>
      prev.map(r => (r.id === registrationId ? { ...r, status } : r))
    );
  };

  const getEventById = useCallback((eventId: number) => {
    return events.find(e => e.id === eventId);
  }, [events]);

  const getUserById = useCallback((userId: number) => {
    return users.find(u => u.id === userId);
  }, [users]);

  const getRegistrationsForEvent = useCallback((eventId: number) => {
    return registrations.filter(r => r.eventId === eventId);
  }, [registrations]);

  const getApprovedAttendeeCount = useCallback((eventId: number) => {
    return registrations.filter(r => r.eventId === eventId && r.status === RegistrationStatus.APPROVED).length;
  }, [registrations]);

  const getUserRegistrationStatus = useCallback((eventId: number, userId: number | undefined) => {
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