import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, Calendar as CalendarIcon, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';
import { eventCategories } from '@/lib/mockData';
import { EventCategory } from '@/types';

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  locationFilter: string;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDate,
  onDateChange,
  locationFilter,
  onLocationChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {eventCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.icon} {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Location..."
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            className="pl-10 w-[200px]"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {eventCategories.find(cat => cat.value === selectedCategory)?.icon}
              {eventCategories.find(cat => cat.value === selectedCategory)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onCategoryChange('all')}
              />
            </Badge>
          )}
          {selectedDate && (
            <Badge variant="secondary" className="gap-1">
              {format(selectedDate, 'MMM dd, yyyy')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onDateChange(undefined)}
              />
            </Badge>
          )}
          {locationFilter && (
            <Badge variant="secondary" className="gap-1">
              {locationFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onLocationChange('')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};