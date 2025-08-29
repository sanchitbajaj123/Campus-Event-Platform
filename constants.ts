
import { User, Event, UserRole } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Rahul (Organizer)', role: UserRole.ORGANIZER, email: 'organizer@campus.com', password: 'password123' },
  { id: 2, name: 'Shivang (Student)', role: UserRole.STUDENT, email: 'shivang@student.com', password: 'password123' },
  { id: 4, name: 'Sanjay (Admin)', role: UserRole.ADMIN, email: 'admin@campus.com', password: 'password123' },
];

export const EVENTS: Event[] = [
  {
    id: 1,
    title: 'Annual Tech Summit 2024',
    description: 'Exploring the future of technology and innovation.',
    longDescription: 'Join us for a full day of insightful talks, workshops, and networking opportunities with leaders from the tech industry. Topics include AI, blockchain, and sustainable tech.',
    date: '2024-10-26T09:00:00',
    location: 'Main Auditorium',
    organizer: 'Tech Club',
    imageUrl: 'https://picsum.photos/seed/tech/600/400',
    maxCapacity: 200,
  },
  {
    id: 2,
    title: 'Campus Music Festival',
    description: 'A vibrant celebration of music and arts.',
    longDescription: 'Experience a fantastic lineup of student bands and local artists. Food trucks, art installations, and great vibes are guaranteed. Don\'t miss the biggest musical event of the year!',
    date: '2024-11-15T14:00:00',
    location: 'Central Lawn',
    organizer: 'Arts Society',
    imageUrl: 'https://picsum.photos/seed/music/600/400',
    maxCapacity: 500,
  },
  {
    id: 3,
    title: 'Career Fair & Networking Event',
    description: 'Connect with top employers and kickstart your career.',
    longDescription: 'Meet representatives from leading companies in various fields. Bring your resume, dress professionally, and be prepared to network. An excellent opportunity for internships and full-time positions.',
    date: '2024-11-05T10:00:00',
    location: 'University Gymnasium',
    organizer: 'Career Services',
    imageUrl: 'https://picsum.photos/seed/career/600/400',
    maxCapacity: 300,
  },
  {
    id: 4,
    title: 'Hackathon: Code for Good',
    description: 'A 24-hour coding competition to solve real-world problems.',
    longDescription: 'Team up and build innovative solutions for social good. Prizes, mentorship, and free food will be provided. All skill levels are welcome. Let\'s code a better future together!',
    date: '2024-12-01T18:00:00',
    location: 'Computer Science Building',
    organizer: 'Coding Club',
    imageUrl: 'https://picsum.photos/seed/hackathon/600/400',
    maxCapacity: 100,
  },
];