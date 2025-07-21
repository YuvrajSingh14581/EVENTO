import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { mockEvents, eventCategories } from '@/lib/mockData';
import { Calendar, Clock, MapPin, User, Users, Share2, Heart, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = eventCategories.find(cat => cat.value === event.category);
  const eventDate = new Date(`${event.date}T${event.time}`);
  const lowestPrice = Math.min(...event.tickets.map(t => t.price));
  const hasAvailableTickets = event.tickets.some(t => t.remaining > 0);
  const totalAttendees = event.tickets.reduce((sum, ticket) => sum + (ticket.quantity - ticket.remaining), 0);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Event link has been copied to your clipboard.',
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? 'Removed from favorites' : 'Added to favorites',
      description: isLiked ? 'Event removed from your favorites.' : 'Event added to your favorites.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(-1)}
                className="bg-white/90 hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Badge variant="secondary" className="bg-white/90">
                {categoryInfo?.icon} {categoryInfo?.label}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{format(eventDate, 'EEEE, MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{format(eventDate, 'h:mm a')}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{totalAttendees} attending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>About This Event</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={isLiked ? 'text-red-500 border-red-500' : ''}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Event Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Hosted by <strong>{event.hostName}</strong></span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span><strong>{totalAttendees}</strong> people attending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {event.location.address}
                </p>
                <GoogleMap
                  center={event.location.coordinates}
                  markers={[{
                    position: event.location.coordinates,
                    title: event.title,
                    info: event.location.address
                  }]}
                  height="300px"
                  className="rounded-lg border"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Get Your Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{ticket.name}</h4>
                      <div className="text-right">
                        {ticket.price === 0 ? (
                          <span className="text-lg font-bold text-green-600">Free</span>
                        ) : (
                          <span className="text-lg font-bold">₹{ticket.price}</span>
                        )}
                      </div>
                    </div>
                    {ticket.description && (
                      <p className="text-sm text-muted-foreground">{ticket.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {ticket.remaining} of {ticket.quantity} remaining
                      </span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ 
                            width: `${((ticket.quantity - ticket.remaining) / ticket.quantity) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="space-y-3 pt-4">
                  <Link to={`/events/${event.id}/book`} className="block">
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={!hasAvailableTickets}
                    >
                      {hasAvailableTickets ? 'Book Tickets' : 'Sold Out'}
                    </Button>
                  </Link>
                  
                  {hasAvailableTickets && (
                    <p className="text-xs text-center text-muted-foreground">
                      Secure booking • Instant confirmation
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">{totalAttendees}</div>
                    <div className="text-sm text-muted-foreground">Attendees</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {event.tickets.reduce((sum, t) => sum + t.remaining, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span>{categoryInfo?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event Type</span>
                    <span>{event.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{format(new Date(event.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};