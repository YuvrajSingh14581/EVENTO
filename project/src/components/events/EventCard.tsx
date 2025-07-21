import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { eventCategories } from '@/lib/mockData';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const categoryInfo = eventCategories.find(cat => cat.value === event.category);
  const eventDate = new Date(`${event.date}T${event.time}`);
  const lowestPrice = Math.min(...event.tickets.map(t => t.price));
  const hasAvailableTickets = event.tickets.some(t => t.remaining > 0);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {categoryInfo?.icon} {categoryInfo?.label}
            </Badge>
          </div>
          {!hasAvailableTickets && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Sold Out
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{format(eventDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{format(eventDate, 'h:mm a')}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{event.location.address}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.hostName}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-lg font-semibold">
            {lowestPrice === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>₹{lowestPrice}</span>
            )}
            {event.tickets.length > 1 && lowestPrice > 0 && (
              <span className="text-sm text-muted-foreground ml-1">+</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {event.tickets.reduce((sum, ticket) => sum + (ticket.quantity - ticket.remaining), 0)} attending
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link to={`/events/${event.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Link to={`/events/${event.id}/book`} className="flex-1">
          <Button 
            className="w-full" 
            disabled={!hasAvailableTickets}
          >
            {hasAvailableTickets ? 'Book Now' : 'Sold Out'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};