import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Clock, MapPin, Ticket, Download, Share2, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const BookingConfirmationPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { toast } = useToast();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    // Load booking details
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const foundBooking = bookings.find((b: any) => b.ticketId === ticketId);
    setBooking(foundBooking);
  }, [ticketId]);

  const handleDownloadTicket = () => {
    toast({
      title: 'Download Started',
      description: 'Your e-ticket is being downloaded.',
    });
  };

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: booking.eventTitle,
        text: `I'm attending ${booking.eventTitle}!`,
        url: window.location.origin + `/events/${booking.eventId}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/events/${booking.eventId}`);
      toast({
        title: 'Link copied!',
        description: 'Event link has been copied to your clipboard.',
      });
    }
  };

  const handleEmailConfirmation = () => {
    toast({
      title: 'Email Sent',
      description: 'Confirmation email has been sent to your email address.',
    });
  };

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Booking not found</h1>
          <p className="text-muted-foreground">The booking you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(`${booking.eventDate}T${booking.eventTime}`);

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your ticket has been booked successfully. You'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="h-5 w-5 mr-2" />
                Your Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ticket ID */}
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Ticket ID</div>
                <div className="text-2xl font-mono font-bold tracking-wider">
                  {booking.ticketId}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Present this ID at the event entrance
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{booking.eventTitle}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{format(eventDate, 'EEEE, MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{format(eventDate, 'h:mm a')}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Details */}
              <div className="space-y-3">
                <h4 className="font-semibold">Booking Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <div className="font-medium">{booking.firstName} {booking.lastName}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <div className="font-medium">{booking.email}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ticket Type:</span>
                    <div className="font-medium">{booking.ticketType}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <div className="font-medium">{booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Paid:</span>
                    <div className="font-medium">
                      {booking.totalPrice === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span>₹{booking.totalPrice}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Booked On:</span>
                    <div className="font-medium">{format(new Date(booking.bookedAt), 'MMM dd, yyyy')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button onClick={handleDownloadTicket} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download E-Ticket
                </Button>
                <Button variant="outline" onClick={handleEmailConfirmation} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Confirmation
                </Button>
                <Button variant="outline" onClick={handleShareEvent} className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Important Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Please arrive 15 minutes before the event starts</li>
                  <li>• Bring a valid ID along with your ticket</li>
                  <li>• Your ticket ID will be required for entry</li>
                  <li>• Check your email for additional event updates</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Link to={`/events/${booking.eventId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Event Details
                  </Button>
                </Link>
                <Link to="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full">
                    My Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                Need help? Have questions about your booking?
              </p>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};