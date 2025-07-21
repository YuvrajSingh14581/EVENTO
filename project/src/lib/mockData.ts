import { Event, EventCategory } from '@/types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'React Conference 2024',
    description: 'Join us for the biggest React conference of the year featuring talks from industry leaders, workshops, and networking opportunities.',
    date: '2024-03-15',
    time: '09:00',
    location: {
      address: 'San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103',
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    category: 'tech',
    hostId: '1',
    hostName: 'Tech Events Inc',
    bannerImage: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    tickets: [
      { id: 't1', name: 'Early Bird', price: 2999, quantity: 100, remaining: 45, description: 'Limited early bird pricing' },
      { id: 't2', name: 'Regular', price: 3999, quantity: 200, remaining: 120, description: 'Standard conference ticket' },
      { id: 't3', name: 'VIP', price: 5999, quantity: 50, remaining: 12, description: 'VIP access with exclusive perks' }
    ],
    attendees: [],
    createdAt: '2024-01-15T10:00:00Z',
    isPublic: true
  },
  {
    id: '2',
    title: 'Jazz Night at Blue Note',
    description: 'An intimate evening of smooth jazz featuring local and international artists in our cozy venue.',
    date: '2024-03-20',
    time: '20:00',
    location: {
      address: 'Blue Note Jazz Club, 131 W 3rd St, New York, NY 10012',
      coordinates: { lat: 40.7282, lng: -74.0021 }
    },
    category: 'music',
    hostId: '2',
    hostName: 'Blue Note Entertainment',
    bannerImage: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    tickets: [
      { id: 't4', name: 'General Admission', price: 450, quantity: 150, remaining: 89, description: 'Standing room access' },
      { id: 't5', name: 'Reserved Seating', price: 750, quantity: 80, remaining: 23, description: 'Guaranteed table seating' }
    ],
    attendees: [],
    createdAt: '2024-01-20T14:30:00Z',
    isPublic: true
  },
  {
    id: '3',
    title: 'Digital Marketing Workshop',
    description: 'Learn the latest digital marketing strategies and tools from industry experts. Hands-on workshop with practical exercises.',
    date: '2024-03-25',
    time: '10:00',
    location: {
      address: 'WeWork Times Square, 1460 Broadway, New York, NY 10036',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    category: 'workshop',
    hostId: '1',
    hostName: 'Marketing Pro Academy',
    bannerImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    tickets: [
      { id: 't6', name: 'Workshop Access', price: 1499, quantity: 30, remaining: 8, description: 'Full workshop with materials' }
    ],
    attendees: [],
    createdAt: '2024-02-01T09:15:00Z',
    isPublic: true
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to a panel of investors. Network with entrepreneurs and industry leaders.',
    date: '2024-04-02',
    time: '18:00',
    location: {
      address: 'Silicon Valley Innovation Center, 2955 Campus Dr, San Mateo, CA 94403',
      coordinates: { lat: 37.5407, lng: -122.3131 }
    },
    category: 'business',
    hostId: '3',
    hostName: 'Venture Capital Network',
    bannerImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    tickets: [
      { id: 't7', name: 'Attendee', price: 0, quantity: 200, remaining: 156, description: 'Free admission to watch pitches' },
      { id: 't8', name: 'Networking Pass', price: 500, quantity: 100, remaining: 67, description: 'Includes networking reception' }
    ],
    attendees: [],
    createdAt: '2024-02-10T16:20:00Z',
    isPublic: true
  },
  {
    id: '5',
    title: 'Marathon Training Run',
    description: 'Join our weekly group training run for marathon preparation. All fitness levels welcome.',
    date: '2024-03-30',
    time: '07:00',
    location: {
      address: 'Central Park, New York, NY 10024',
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    category: 'sports',
    hostId: '4',
    hostName: 'NYC Running Club',
    bannerImage: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    tickets: [
      { id: 't9', name: 'Free Participation', price: 0, quantity: 50, remaining: 23, description: 'Free group training session' }
    ],
    attendees: [],
    createdAt: '2024-02-15T12:00:00Z',
    isPublic: true
  },
  {
    id: '6',
    title: 'Contemporary Art Exhibition',
    description: 'Explore cutting-edge contemporary art from emerging and established artists. Opening night reception included.',
    date: '2024-04-10',
    time: '19:00',
    location: {
      address: 'Museum of Modern Art, 11 W 53rd St, New York, NY 10019',
      coordinates: { lat: 40.7614, lng: -73.9776 }
    },
    category: 'art',
    hostId: '5',
    hostName: 'Modern Art Society',
    bannerImage: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    tickets: [
      { id: 't10', name: 'General Admission', price: 250, quantity: 300, remaining: 234, description: 'Access to exhibition' },
      { id: 't11', name: 'VIP Opening', price: 750, quantity: 50, remaining: 18, description: 'Opening reception with artist meet & greet' }
    ],
    attendees: [],
    createdAt: '2024-02-20T11:30:00Z',
    isPublic: true
  }
];

export const eventCategories: { value: EventCategory; label: string; icon: string }[] = [
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'tech', label: 'Technology', icon: '💻' },
  { value: 'workshop', label: 'Workshop', icon: '🛠️' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'art', label: 'Art', icon: '🎨' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'other', label: 'Other', icon: '📅' }
];