
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceLevel: number; // 1 to 4
  address: string;
  summary: string;
  imageUrl: string;
  distance?: string;
  tags: string[];
  links?: Array<{ title: string; uri: string }>;
}

export interface FilterState {
  cuisine: string;
  minRating: number;
  maxPrice: number;
  query: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}
