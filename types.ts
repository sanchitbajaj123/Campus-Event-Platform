
export enum UserRole {
  STUDENT = 'Student',
  ORGANIZER = 'Organizer',
  ADMIN = 'Admin',
}

export enum RegistrationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface User {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  password?: string; // Should be hashed in a real app
}

export interface Event {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  location: string;
  organizer: string;
  imageUrl: string;
  maxCapacity: number;
}

export interface Registration {
  id: number;
  eventId: number;
  userId: number;
  status: RegistrationStatus;
}