import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Event, Registration, UserRole, RegistrationStatus } from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  events: Event[];
  registrations: Registration[];
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  signUp: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  addOrganizer: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  switchUser: (userId: string) => void;
  addEvent: (eventData: Omit<Event, '_id'>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<void>;
  updateRegistrationStatus: (registrationId: string, status: RegistrationStatus) => Promise<void>;
  getEventById: (eventId: string) => Event | undefined;
  getUserById: (userId: string) => User | undefined;
  getRegistrationsForEvent: (eventId: string) => Registration[];
  getApprovedAttendeeCount: (eventId: string) => number;
  getUserRegistrationStatus: (eventId: string, userId: string | undefined) => RegistrationStatus | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const API_BASE = 'https://campus-event-platform-ruby.vercel.app/api';

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const normalizeStatus = (s: any) => (s ? String(s).toUpperCase() : '');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) setUsers(await res.json());
    } catch {}
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (res.ok) setEvents(await res.json());
    } catch {}
  }, []);

  const fetchRegistrations = useCallback(async () => {
    try {
      // populated route returns user and event info along with registration
      const res = await fetch(`${API_BASE}/registrations/populated`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      } else {
        // fallback to unpopulated registrations if populated route missing
        const res2 = await fetch(`${API_BASE}/registrations`);
        if (res2.ok) setRegistrations(await res2.json());
      }
    } catch {}
  }, []);

  useEffect(() => {
    void fetchUsers();
    void fetchEvents();
    void fetchRegistrations();
    // restore last logged in user if present
    const saved = localStorage.getItem('lastLoggedInUser');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {}
    }
  }, [fetchUsers, fetchEvents, fetchRegistrations]);

  const refreshAll = useCallback(() => {
    void fetchUsers();
    void fetchEvents();
    void fetchRegistrations();
  }, [fetchUsers, fetchEvents, fetchRegistrations]);

  const login = useCallback(async (email: string, password?: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const user = await res.json();
      setCurrentUser(user);
      localStorage.setItem('lastLoggedInUser', JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('lastLoggedInUser');
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password?: string) => {
      try {
        const res = await fetch(`${API_BASE}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          let errMsg = 'Signup failed';
          try {
            const err = await res.json();
            if (err.error && err.error.includes('duplicate key')) errMsg = 'Email is already registered.';
            else if (err.error) errMsg = err.error;
          } catch {}
          return { success: false, message: errMsg };
        }
        const user = await res.json();
        setCurrentUser(user);
        localStorage.setItem('lastLoggedInUser', JSON.stringify(user));
        refreshAll();
        return { success: true };
      } catch {
        return { success: false, message: 'Signup failed' };
      }
    },
    [refreshAll]
  );

  const addOrganizer = useCallback(
    async (name: string, email: string, password?: string) => {
      try {
        const res = await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role: 'ORGANIZER' }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { success: false, message: err.error || 'Add organizer failed' };
        }
        refreshAll();
        return { success: true };
      } catch {
        return { success: false, message: 'Add organizer failed' };
      }
    },
    [refreshAll]
  );

  const switchUser = useCallback(
    (userId: string) => {
      const user = users.find((u) => (u as any)._id === userId || (u as any).id === userId);
      if (user) setCurrentUser(user);
    },
    [users]
  );

  const addEvent = useCallback(
    async (eventData: Omit<Event, '_id'>) => {
      try {
        await fetch(`${API_BASE}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
        refreshAll();
      } catch {}
    },
    [refreshAll]
  );

  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (!window.confirm('Are you sure you want to delete this event? This will also remove all associated registrations.')) return;
      try {
        await fetch(`${API_BASE}/events/${eventId}`, { method: 'DELETE' });
        refreshAll();
      } catch {}
    },
    [refreshAll]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      if ((currentUser as any)?._id === userId) {
        alert('You cannot delete your own account.');
        return;
      }
      if (!window.confirm('Are you sure you want to delete this user? This will remove them and all their event registrations.')) return;
      try {
        await fetch(`${API_BASE}/users/${userId}`, { method: 'DELETE' });
        refreshAll();
      } catch {}
    },
    [currentUser, refreshAll]
  );

  const registerForEvent = useCallback(
    async (eventId: string) => {
      if (!currentUser) {
        alert('You must be logged in to register for an event.');
        return;
      }
      const userId = (currentUser as any)._id || (currentUser as any).id;
      const alreadyRegistered = registrations.some((r: any) => {
        const rEventId = r.eventId && r.eventId._id ? r.eventId._id : r.eventId;
        const rUserId = r.userId && r.userId._id ? r.userId._id : r.userId;
        return rEventId === eventId && rUserId === userId;
      });
      if (alreadyRegistered) {
        alert('You are already registered or your registration is pending.');
        return;
      }
      try {
        await fetch(`${API_BASE}/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, userId, status: 'PENDING' }),
        });
        refreshAll();
      } catch {}
    },
    [currentUser, registrations, refreshAll]
  );

  const updateRegistrationStatus = useCallback(
    async (registrationId: string, status: RegistrationStatus) => {
      try {
        await fetch(`${API_BASE}/registrations/${registrationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        refreshAll();
      } catch {}
    },
    [refreshAll]
  );

  const getEventById = useCallback(
    (eventId: string | any) => {
      if (!eventId) return undefined;
      // If a populated event object was passed, try to resolve to the canonical event in state,
      // otherwise return the object directly so callers can read fields like title.
      if (typeof eventId === 'object') {
        const id = eventId._id || eventId.id;
        const found = events.find((e: any) => e._id === id || e.id === id);
        return found || eventId;
      }
      return events.find((e: any) => e._id === eventId || e.id === eventId);
    },
    [events]
  );

  const getUserById = useCallback(
    (userId: string | any) => {
      if (!userId) return undefined;
      // Handle populated user object (from registrations/populated) or id string
      if (typeof userId === 'object') {
        const id = userId._id || userId.id;
        const found = users.find((u: any) => u._id === id || u.id === id);
        return found || userId;
      }
      return users.find((u: any) => u._id === userId || u.id === userId);
    },
    [users]
  );

  const getRegistrationsForEvent = useCallback(
    (eventId: string) => {
      return registrations.filter((r: any) => {
        const rEventId = r.eventId && r.eventId._id ? r.eventId._id : r.eventId;
        return rEventId === eventId;
      });
    },
    [registrations]
  );

  const getApprovedAttendeeCount = useCallback(
    (eventId: string) => {
      return registrations.filter((r: any) => {
        const rEventId = r.eventId && r.eventId._id ? r.eventId._id : r.eventId;
        return rEventId === eventId && normalizeStatus(r.status) === 'APPROVED';
      }).length;
    },
    [registrations]
  );

  const getUserRegistrationStatus = useCallback(
    (eventId: string, userId: string | undefined) => {
      if (!userId) return null;
      const registration = registrations.find((r: any) => {
        const rEventId = r.eventId && r.eventId._id ? r.eventId._id : r.eventId;
        const rUserId = r.userId && r.userId._id ? r.userId._id : r.userId;
        return rEventId === eventId && rUserId === userId;
      });
      return registration ? (registration as any).status : null;
    },
    [registrations]
  );

  const value: AppContextType = {
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
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};