export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  category: string;
  hostId: string;
  hostName: string;
  bannerImage?: string;
  tickets: TicketType[];
  attendees: Attendee[];
  createdAt: string;
  isPublic: boolean;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  remaining: number;
  description?: string;
}

export interface Attendee {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketId: string;
  ticketType: string;
  bookedAt: string;
  attended: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  ticketTypeId: string;
  ticketId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedAt: string;
}

export type EventCategory = 'music' | 'tech' | 'workshop' | 'business' | 'sports' | 'art' | 'food' | 'other';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}