
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
  _id?: string;
  id?: number;
  name: string;
  role: UserRole | string;
  email: string;
  password?: string;
}

export interface Event {
  _id?: string;
  id?: number;
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
  _id?: string;
  id?: number;
  eventId: string;
  userId: string;
  status: RegistrationStatus | string;
}