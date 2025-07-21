import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { eventCategories } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Plus, X, Upload, DollarSign } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  address: z.string().min(5, 'Please enter a valid address'),
  bannerImage: z.string().url('Please enter a valid image URL').optional(),
});

const ticketSchema = z.object({
  name: z.string().min(1, 'Ticket name is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  description: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;
type TicketFormData = z.infer<typeof ticketSchema>;

export const CreateEventPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [tickets, setTickets] = useState<(TicketFormData & { id: string })[]>([
    { id: uuidv4(), name: 'General Admission', price: 0, quantity: 100, description: '' }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const watchedCategory = watch('category');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to create an event.</p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  const addTicket = () => {
    setTickets([...tickets, {
      id: uuidv4(),
      name: '',
      price: 0,
      quantity: 1,
      description: ''
    }]);
  };

  const removeTicket = (id: string) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  const updateTicket = (id: string, field: keyof TicketFormData, value: any) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ));
  };

  const onLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation({ lat: location.lat, lng: location.lng });
    setValue('address', location.address);
  };

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    
    try {
      // Validate tickets
      const validTickets = tickets.filter(t => t.name.trim() !== '');
      if (validTickets.length === 0) {
        toast({
          title: 'Validation Error',
          description: 'Please add at least one ticket type.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Simulate event creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const eventId = uuidv4();
      const newEvent = {
        id: eventId,
        ...data,
        location: {
          address: data.address,
          coordinates: selectedLocation,
        },
        hostId: user.id,
        hostName: user.name,
        bannerImage: data.bannerImage || 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
        tickets: validTickets.map(ticket => ({
          ...ticket,
          remaining: ticket.quantity,
        })),
        attendees: [],
        createdAt: new Date().toISOString(),
        isPublic: true,
      };

      // Store event in localStorage (in a real app, this would be sent to a backend)
      const existingEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
      existingEvents.push(newEvent);
      localStorage.setItem('userEvents', JSON.stringify(existingEvents));

      toast({
        title: 'Event Created!',
        description: `${data.title} has been created successfully.`,
      });

      navigate(`/events/${eventId}`);
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: 'There was an error creating your event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Share your event with the community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event..."
                      rows={4}
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.icon} {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bannerImage">Banner Image URL (Optional)</Label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="bannerImage"
                        placeholder="https://example.com/image.jpg"
                        className="pl-10"
                        {...register('bannerImage')}
                      />
                    </div>
                    {errors.bannerImage && (
                      <p className="text-sm text-destructive">{errors.bannerImage.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        {...register('date')}
                      />
                      {errors.date && (
                        <p className="text-sm text-destructive">{errors.date.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        {...register('time')}
                      />
                      {errors.time && (
                        <p className="text-sm text-destructive">{errors.time.message}</p>
                      )}
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
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter event address"
                      {...register('address')}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Select Location on Map</Label>
                    <GoogleMap
                      center={selectedLocation}
                      onLocationSelect={onLocationSelect}
                      height="300px"
                      className="rounded-lg border"
                    />
                    <p className="text-sm text-muted-foreground">
                      Click on the map to select the exact location
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Ticket Types
                    </CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={addTicket}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ticket
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <div key={ticket.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Ticket {index + 1}</h4>
                        {tickets.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTicket(ticket.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Ticket Name</Label>
                          <Input
                            placeholder="e.g., General Admission"
                            value={ticket.name}
                            onChange={(e) => updateTicket(ticket.id, 'name', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Price (₹)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={ticket.price}
                            onChange={(e) => updateTicket(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="100"
                            value={ticket.quantity}
                            onChange={(e) => updateTicket(ticket.id, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input
                          placeholder="Brief description of this ticket type"
                          value={ticket.description}
                          onChange={(e) => updateTicket(ticket.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Event Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2">
                      {watch('title') || 'Event Title'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Hosted by {user.name}
                    </p>
                  </div>

                  {watchedCategory && (
                    <Badge variant="secondary">
                      {eventCategories.find(cat => cat.value === watchedCategory)?.icon}{' '}
                      {eventCategories.find(cat => cat.value === watchedCategory)?.label}
                    </Badge>
                  )}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    {watch('date') && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{watch('date')}</span>
                      </div>
                    )}
                    {watch('time') && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{watch('time')}</span>
                      </div>
                    )}
                    {watch('address') && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="line-clamp-2">{watch('address')}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Tickets</h4>
                    {tickets.filter(t => t.name.trim() !== '').map((ticket) => (
                      <div key={ticket.id} className="flex justify-between text-sm">
                        <span>{ticket.name}</span>
                        <span>{ticket.price === 0 ? 'Free' : `₹${ticket.price}`}</span>
                      </div>
                    ))}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : null}
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};