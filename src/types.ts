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

export interface CabBookingResult {
  bookingId: string;
  service: string;
  pickup: string;
  destination: string;
  driver: {
    name: string;
    rating: number;
    carModel: string;
    licensePlate: string;
    avatar: string;
    phone: string;
  };
  etaMinutes: number;
  fareEstimate: string;
  otp: string;
  status: 'assigned' | 'arriving' | 'in_transit' | 'completed';
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

export interface ToolCallExecution {
  id: string;
  toolName: string;
  args: any;
  status: 'pending' | 'success' | 'failed';
  result?: CabBookingResult | TrainStatusResult | CalendarEventResult | PriceLookupResult | any;
  executedAt: string;
}
