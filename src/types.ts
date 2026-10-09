export type ThemeMode = 'dark' | 'light';

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'executing';

export interface AgoraConfig {
  appId: string;
  channel: string;
  token: string;
  uid?: number;
  useCloudAgent?: boolean;
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface MCPLogEntry {
  id: string;
  timestamp: string;
  direction: 'client_to_server' | 'server_to_client';
  method: string;
  payload: any;
  durationMs?: number;
}

export interface CabRideOption {
  service: string;
  name: string;
  vehicleModel: string;
  fare: string;
  numericFare: number;
  etaMinutes: number;
  capacity: string;
  badge?: string;
  description: string;
  uberDeepLink: string;
}

export interface RouteSummary {
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy';
}

export interface CabBookingResult {
  bookingId: string;
  service: string;
  pickup: string;
  destination: string;
  route?: RouteSummary;
  options?: CabRideOption[];
  driver: {
    name: string;
    rating: number;
    carModel: string;
    licensePlate: string;
    avatar: string;
    phone: string;
    trips?: number;
    languages?: string;
  };
  etaMinutes: number;
  fareEstimate: string;
  otp: string;
  status: 'assigned' | 'arriving' | 'in_transit' | 'completed';
  uberDeepLink?: string;
  surgeMultiplier?: string;
  tollIncluded?: boolean;
  paymentMethod?: string;
}

export interface TrainStatusResult {
  trainNumber: string;
  trainName: string;
  departureStation: string;
  arrivalStation: string;
  scheduledDeparture: string;
  actualDeparture: string;
  statusText: string;
  delayMinutes: number;
  platform: string;
  pnr?: string;
  coachPosition: string;
  currentSpeed?: string;
  nextStation?: string;
  cateringStatus?: string;
}

export interface FlightStatusResult {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  estimatedDeparture: string;
  terminal: string;
  gate: string;
  baggageBelt: string;
  status: 'On Time' | 'Boarding' | 'Departed' | 'Delayed';
  securityWaitMins: number;
}

export interface CalendarEventResult {
  eventId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  category: 'travel' | 'meeting' | 'reminder' | 'task';
  attendees: string[];
  hasConflict: boolean;
  conflictDetails?: string;
}

export interface PriceLookupResult {
  product: string;
  category: string;
  cheapestVendor: string;
  lowestPrice: string;
  averagePrice: string;
  options: Array<{
    store: string;
    price: string;
    deliveryTime: string;
    inStock: boolean;
    rating: number;
  }>;
}

export interface ForgeBasicsResult {
  title: string;
  creator: string;
  tagline: string;
  pipeline: {
    voiceIngestion: string;
    intelligence: string;
    executionProtocol: string;
    speechOutput: string;
  };
  pillars: Array<{
    name: string;
    description: string;
    sampleCommand: string;
    badge: string;
  }>;
  models: {
    p1: string;
    p2: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  provider: 'apple' | 'google' | 'guest';
  tier: string;
  homeAddress?: string;
  workAddress?: string;
  preferredRideService?: 'UberGo' | 'Premier' | 'UberXL' | 'Uber Black';
  frequentDestinations?: string[];
  preferences?: {
    temperature?: string;
    quietRide?: boolean;
    autoConfirmThreshold?: string;
  };
}

export interface UserMemoryResult {
  action: 'recalled' | 'updated';
  key: string;
  value: string;
  currentProfile: Partial<UserProfile>;
  message: string;
}

export interface ToolCallExecution {
  id: string;
  toolName: string;
  args: any;
  status: 'pending' | 'success' | 'failed';
  result?: CabBookingResult | TrainStatusResult | FlightStatusResult | CalendarEventResult | PriceLookupResult | ForgeBasicsResult | UserMemoryResult | any;
  executedAt: string;
}

