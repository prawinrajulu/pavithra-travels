export interface Destination {
  id: string;
  name: string;
  state: string;
  category: 'temple' | 'family' | 'adventure' | 'beach' | 'hill-station';
  region: 'north' | 'south' | 'east' | 'west' | 'central';
  duration: string;
  durationDays: number;
  budget: string;
  estimatedCost: number;
  bestSeason: string;
  highlights: string[];
  description: string;
  imageUrl: string;
  images?: string[];
  itinerary?: ItineraryDay[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string;
}

export interface DestinationFilters {
  category?: string;
  region?: string;
  maxBudget?: number;
  minDays?: number;
  maxDays?: number;
}
