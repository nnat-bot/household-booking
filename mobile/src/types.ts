export type Role = 'customer' | 'provider';

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
  bio: string | null;
  hourly_rate: string | null;
};

export type LoginResult = {
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>;
  token: string;
};

export type Service = {
  id: number;
  category: string;
  title: string;
  description: string | null;
  price_from: string;
  provider_id: number;
  provider_name: string;
  avatar_url: string | null;
  hourly_rate: string;
};

export type ProviderService = {
  id: number;
  category: string;
  title: string;
  description: string | null;
  price_from: string;
};

export type Category = {
  category: string;
  cheapest: string;
};

export type Cleaner = {
  id: number;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  hourly_rate: string;
  rating: string | null;
  review_count: string;
};

export type Review = {
  rating: number;
  comment: string | null;
  created_at: string;
  customer_name: string;
};

export type CleanerProfile = {
  id: number;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  hourly_rate: string;
  rating: string | null;
  services: ProviderService[];
  reviews: Review[];
};

export type Slot = {
  start_time: string;
  end_time: string;
};

export type WorkingHours = {
  id: number;
  weekday: number;
  start_time: string;
  end_time: string;
};

export type Booking = {
  id: number;
  status: BookingStatus;
  booking_date: string;
  start_time: string;
  end_time: string;
  estimated_price: string;
  service_title: string;
  category: string;
  provider_name?: string;
  customer_name?: string;
  avatar_url?: string | null;
};

export type BookingDetail = Booking & {
  customer_id: number;
  provider_id: number;
  customer_name: string;
  provider_name: string;
  review_rating: number | null;
  review_comment: string | null;
};

export type Message = {
  id: number;
  sender_id: number;
  body: string;
  created_at: string;
  sender_name?: string;
};

export type NewBooking = {
  providerId: number;
  serviceId: number;
  date: string;
  startTime: string;
  endTime: string;
};
