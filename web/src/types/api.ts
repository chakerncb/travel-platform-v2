// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

// Enums
export enum DestinationType {
  City = 'City',
  Region = 'Region',
  NaturalSite = 'NaturalSite',
  Landmark = 'Landmark'
}

export enum TourType {
  PrePackaged = 'PrePackaged',
  CustomRequest = 'CustomRequest'
}

export enum TourStatus {
  Draft = 'Draft',
  Published = 'Published',
  Archived = 'Archived',
  PendingApproval = 'PendingApproval'
}

export enum DifficultyLevel {
  Easy = 'Easy',
  Moderate = 'Moderate',
  Challenging = 'Challenging',
  Difficult = 'Difficult'
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed'
}

// Destination Types
export interface DestinationImageDto {
  id: number;
  image_path: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
}

export interface DestinationDto {
  id: number;
  name: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  short_description?: string;
  city?: string;
  country: string;
  is_active: boolean;
  images?: DestinationImageDto[];
  primary_image?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDestinationDto {
  name: string;
  nameAr?: string;
  nameFr?: string;
  slug: string;
  destinationType?: DestinationType;
  country?: string;
  latitude?: number;
  longitude?: number;
  nearestAirportCode?: string;
  airportDistanceKm?: number;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured?: boolean;
}

export interface UpdateDestinationDto {
  destinationId?: string;
  name?: string;
  nameAr?: string;
  nameFr?: string;
  slug?: string;
  destinationType?: DestinationType;
  country?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  nearestAirportCode?: string;
  airportDistanceKm?: number;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  popularityScore?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

// Hotel Types
export interface HotelImageDto {
  id: number;
  image_path: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
}

export interface HotelDto {
  id: number;
  hotelId?: string;
  amadeusHotelId?: string;
  bookingComId?: string;
  name: string;
  nameAr?: string;
  star_rating?: number;
  starRating?: number;
  destinationId?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: string;
  longitude?: number;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  website_url?: string;
  description?: string;
  amenities?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  galleryUrls?: string;
  gallery_urls?: string;
  priceFrom?: number;
  price_per_night?: number;
  currency?: string;
  rating?: number;
  totalReviews?: number;
  total_reviews?: number;
  dataSource?: string;
  data_source?: string;
  isVirtual?: boolean;
  is_virtual?: boolean;
  lastSyncedAt?: string;
  last_synced_at?: string;
  isActive?: boolean;
  is_active?: boolean;
  images?: HotelImageDto[];
  primary_image?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface CreateHotelDto {
  amadeusHotelId?: string;
  bookingComId?: string;
  name: string;
  nameAr?: string;
  starRating?: number;
  destinationId?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  description?: string;
  amenities?: string;
  thumbnailUrl?: string;
  galleryUrls?: string;
  priceFrom?: number;
  currency?: string;
  dataSource?: string;
  isVirtual?: boolean;
}

export interface UpdateHotelDto {
  amadeusHotelId?: string;
  bookingComId?: string;
  name?: string;
  nameAr?: string;
  starRating?: number;
  destinationId?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  description?: string;
  amenities?: string;
  thumbnailUrl?: string;
  galleryUrls?: string;
  priceFrom?: number;
  currency?: string;
  dataSource?: string;
  isVirtual?: boolean;
  isActive?: boolean;
}

export interface HotelSearchParams {
  city?: string;
  minStarRating?: number;
  maxPrice?: number;
  name?: string;
}

// Tour Types
// Backend API Response (snake_case)
export interface TourApiResponse {
  id: number;
  type: string;
  title: string;
  description?: string;
  short_description?: string;
  price: string;
  duration_days: number;
  max_group_size: number;
  difficulty_level: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_eco_friendly: boolean;
  included_services?: string[];
  excluded_services?: string[];
  destinations?: any[];
  hotels?: any[];
  reviews_count: number;
  average_rating?: number;
  created_at: string;
  updated_at: string;
}

// Frontend DTO (for backwards compatibility)
export interface TourDestinationDto {
  id: number;
  name: string;
  city?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  short_description?: string;
  days_at_destination: number;
  order: number;
  image_url?: string;
  image_alt?: string;
}

export interface TourHotelDto {
  id: number;
  name: string;
  city?: string;
  country?: string;
  star_rating?: number;
  nights: number;
  order: number;
}

export interface TourDto {
  id: number;
  type: string;
  title: string;
  description?: string;
  short_description?: string;
  price: string;
  duration_days: number;
  max_group_size: number;
  difficulty_level?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_eco_friendly: boolean;
  included_services?: string[];
  excluded_services?: string[];
  destinations?: TourDestinationDto[];
  hotels?: TourHotelDto[];
  reviews_count: number;
  booked_places?: number;
  remaining_places?: number;
  created_at: string;
  updated_at: string;
}

export interface TourHotelDto {
  hotelId: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfNights?: number;
  roomsCount?: number;
  roomType?: string;
}

export interface CreateTourRequestDto {
  agencyId?: string;
  title: string;
  slug: string;
  description?: string;
  tourType?: TourType;
  primaryDestinationId?: string;
  durationDays?: number;
  durationNights?: number;
  pricePerPerson?: number;
  currency?: string;
  priceIncludes?: string[];
  priceExcludes?: string[];
  minParticipants?: number;
  maxParticipants?: number;
  difficultyLevel?: DifficultyLevel;
  ageRestriction?: string;
  fitnessRequirement?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
  videoUrl?: string;
  itinerary?: string;
  features?: string[];
  languages?: string[];
  isFeatured?: boolean;
  availableFrom?: string;
  availableTo?: string;
  destinations?: TourDestinationDto[];
  hotels?: TourHotelDto[];
}

export interface UpdateTourRequestDto {
  title?: string;
  slug?: string;
  description?: string;
  tourType?: TourType;
  primaryDestinationId?: string;
  durationDays?: number;
  durationNights?: number;
  pricePerPerson?: number;
  currency?: string;
  priceIncludes?: string[];
  priceExcludes?: string[];
  minParticipants?: number;
  maxParticipants?: number;
  difficultyLevel?: DifficultyLevel;
  ageRestriction?: string;
  fitnessRequirement?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
  videoUrl?: string;
  itinerary?: string;
  features?: string[];
  languages?: string[];
  status?: TourStatus;
  isFeatured?: boolean;
  availableFrom?: string;
  availableTo?: string;
  destinations?: TourDestinationDto[];
  hotels?: TourHotelDto[];
}

export interface CustomTourRequestDto {
  title: string;
  description?: string;
  durationDays: number;
  durationNights: number;
  adultsCount: number;
  childrenCount?: number;
  infantsCount?: number;
  preferredStartDate: string;
  destinationIds: string[];
  hotelIds?: string[];
  specialRequirements?: string;
  budgetPerPerson?: number;
}

// Travel Agency Types
export interface TravelAgencyDto {
  agencyId: string;
  userId: string;
  agencyName: string;
  businessLicense?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  country: string;
  phone?: string;
  commissionRate: number;
  rating: number;
  totalBookings: number;
  isVerified: boolean;
  verificationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTravelAgencyDto {
  agencyName: string;
  businessLicense: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  country?: string;
  phone?: string;
  commissionRate?: number;
}

export interface UpdateTravelAgencyDto {
  agencyName?: string;
  businessLicense?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  country?: string;
  phone?: string;
  commissionRate?: number;
}

// User and Authentication Types
export interface UserDto {
  id?: string;
  f_name?: string;
  l_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_admin?: boolean;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  // For backwards compatibility
  userName?: string;
  phoneNumber?: string;
  role?: string;
  status?: boolean;
  imageUrl?: string;
  isIntern?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  f_name: string;
  l_name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

// Image Types
export interface ImageDto {
  imageId: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  isPrimary: boolean;
  displayOrder: number;
  altText?: string;
  caption?: string;
  source?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: { [key: string]: string[] };
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Booking interfaces
export interface PassengerInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  nationality?: string;
}

export interface BookingDto {
  id: number;
  tour_id: number;
  user_id?: number;
  booking_reference: string;
  start_date: string;
  end_date: string;
  adults_count: number;
  children_count: number;
  total_price: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  contact_date_of_birth?: string;
  contact_passport_number?: string;
  contact_nationality?: string;
  passengers?: PassengerInfo[];
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  amount_paid: string;
  payment_method?: string;
  payment_transaction_id?: string;
  payment_date?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  tour?: TourDto;
}

export interface CreateBookingDto {
  tour_id: number;
  start_date: string;
  end_date: string;
  adults_count: number;
  children_count: number;
  total_price: number;
  main_contact: PassengerInfo;
  passengers?: PassengerInfo[];
  special_requests?: string;
}

export interface BookingAvailabilityDto {
  tour_id: number;
  max_group_size: number;
  booked_places: number;
  remaining_places: number;
  is_fully_booked: boolean;
}

// Wishlist Types
export enum WishlistItemType {
  Tour = 'Tour',
  Destination = 'Destination',
  Hotel = 'Hotel'
}

export interface WishlistItemDto {
  id: number;
  type: WishlistItemType;
  item: {
    id: number;
    title?: string;
    name?: string;
    short_description?: string;
    price?: string;
    duration_days?: number;
    difficulty_level?: string;
    start_date?: string;
    end_date?: string;
    is_eco_friendly?: boolean;
    city?: string;
    country?: string;
    primary_image?: DestinationImageDto | HotelImageDto | null;
    star_rating?: number;
    price_per_night?: string;
  };
  added_at: string;
}

export interface AddToWishlistDto {
  type: WishlistItemType;
  id: number;
}

export interface WishlistCheckDto {
  in_wishlist: boolean;
}

// User Tours Types
export interface UserTourDto {
  booking_id: number;
  booking_reference: string;
  booking_status: string;
  payment_status: string;
  booking_date?: string;
  start_date: string;
  end_date: string;
  adults_count: number;
  children_count: number;
  total_price: string;
  amount_paid?: string;
  tour: {
    id: number;
    title: string;
    type: string;
    short_description?: string;
    description?: string;
    price: string;
    duration_days: number;
    difficulty_level: string;
    is_eco_friendly: boolean;
    destinations?: DestinationDto[];
    hotels?: HotelDto[];
  };
}
