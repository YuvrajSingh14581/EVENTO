import React, { useState, useMemo } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { mockEvents } from '@/lib/mockData';
import { EventCategory } from '@/types';
import { format, isAfter, isSameDay } from 'date-fns';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [locationFilter, setLocationFilter] = useState('');

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.hostName.toLowerCase().includes(query) ||
          event.location.address.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && event.category !== selectedCategory) {
        return false;
      }

      // Date filter
      if (selectedDate) {
        const eventDate = new Date(event.date);
        if (!isSameDay(eventDate, selectedDate)) {
          return false;
        }
      }

      // Location filter
      if (locationFilter) {
        const location = locationFilter.toLowerCase();
        if (!event.location.address.toLowerCase().includes(location)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDate, locationFilter]);

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedDate || locationFilter;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDate(undefined);
    setLocationFilter('');
  };

  const featuredEvents = mockEvents.slice(0, 3);
  const upcomingEvents = mockEvents.filter(event => 
    isAfter(new Date(`${event.date}T${event.time}`), new Date())
  ).slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover Amazing
            <span className="text-primary block">Events Near You</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with your community through incredible events. From tech conferences to art exhibitions, 
            find experiences that inspire and engage.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="text-sm text-muted-foreground">
            🎉 <strong>{mockEvents.length}</strong> events available
          </div>
          <div className="text-sm text-muted-foreground">
            🌟 <strong>{mockEvents.filter(e => e.tickets.some(t => t.price === 0)).length}</strong> free events
          </div>
          <div className="text-sm text-muted-foreground">
            📍 <strong>Multiple cities</strong>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Featured Events</h2>
          <p className="text-muted-foreground">Don't miss these popular events</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Event Discovery */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Explore All Events</h2>
          <p className="text-muted-foreground">Find the perfect event for you</p>
        </div>

        {/* Filters */}
        <EventFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {hasActiveFilters ? 'Search Results' : 'Upcoming Events'}
              <span className="text-muted-foreground ml-2">
                ({filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'})
              </span>
            </h3>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-semibold">No events found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any events matching your criteria. Try adjusting your filters or search terms.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};