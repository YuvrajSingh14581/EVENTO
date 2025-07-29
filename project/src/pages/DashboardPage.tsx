import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Event, Booking } from '@/types';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Eye, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);

  useEffect(() => {
    // Load user's created events
    const events = JSON.parse(localStorage.getItem('userEvents') || '[]');
    const userEvents = events.filter((event: Event) => event.hostId === user?.id);
    setCreatedEvents(userEvents);

    // Load user's bookings
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    setUserBookings(bookings);
  }, [user]);

  const deleteEvent = (eventId: string) => {
    const events = JSON.parse(localStorage.getItem('userEvents') || '[]');
    const updatedEvents = events.filter((event: Event) => event.id !== eventId);
    localStorage.setItem('userEvents', JSON.stringify(updatedEvents));
    setCreatedEvents(updatedEvents.filter((event: Event) => event.hostId === user?.id));
    
    toast({
      title: 'Event Deleted',
      description: 'Your event has been deleted successfully.',
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Manage your events and bookings</p>
      </div>

      <Tabs defaultValue="created" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">My Created Events</TabsTrigger>
          <TabsTrigger value="joined">My Joined Events</TabsTrigger>
        </TabsList>

        {/* Created Events */}
        <TabsContent value="created" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Created Events</h2>
            <Link to="/create-event">
              <Button>Create New Event</Button>
            </Link>
          </div>

          {createdEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first event to share with the community.
                </p>
                <Link to="/create-event">
                  <Button>Create Your First Event</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdEvents.map((event) => {
                const eventDate = new Date(`${event.date}T${event.time}`);
                const totalAttendees = event.tickets.reduce((sum, ticket) => sum + (ticket.quantity - ticket.remaining), 0);
                const totalRevenue = event.tickets.reduce((sum, ticket) => sum + (ticket.price * (ticket.quantity - ticket.remaining)), 0);

                return (
                  <Card key={event.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="h-32 w-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Link to={`/events/${event.id}`}>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-8 w-8 p-0"
                            onClick={() => toast({ title: 'Edit functionality coming soon!' })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 w-8 p-0"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(eventDate, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{format(eventDate, 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="line-clamp-1">{event.location.address}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary">{totalAttendees}</div>
                          <div className="text-xs text-muted-foreground">Attendees</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">₹{totalRevenue}</div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link to={`/events/${event.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Event
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => toast({ title: 'Attendee list coming soon!' })}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Attendees
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Joined Events */}
        <TabsContent value="joined" className="space-y-6">
          <h2 className="text-2xl font-semibold">Joined Events</h2>

          {userBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events joined yet</h3>
                <p className="text-muted-foreground mb-4">
                  Discover and join exciting events in your area.
                </p>
                <Link to="/">
                  <Button>Explore Events</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBookings.map((booking) => {
                const eventDate = new Date(`${booking.eventDate}T${booking.eventTime}`);

                return (
                  <Card key={booking.ticketId} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          Ticket #{booking.ticketId.slice(-8)}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Confirmed
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2">{booking.eventTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.firstName} {booking.lastName}
                        </p>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(eventDate, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{format(eventDate, 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Ticket className="h-4 w-4 mr-2" />
                          <span>{booking.ticketType} × {booking.quantity}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-lg font-bold">
                          {booking.totalPrice === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            <span>₹{booking.totalPrice}</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Booked {format(new Date(booking.bookedAt), 'MMM dd')}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link to={`/events/${booking.eventId}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Event
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => toast({ 
                            title: 'Ticket Details', 
                            description: `Ticket ID: ${booking.ticketId}` 
                          })}
                        >
                          <Ticket className="h-4 w-4 mr-1" />
                          Ticket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};