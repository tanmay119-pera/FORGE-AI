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
    diurnalPreferences?: {
      morningBufferMins?: number;
      eveningPickup?: string;
      highTrafficAlternative?: string;
    };
  };
}

export interface UserMemoryResult {
  action: 'recalled' | 'updated';
  key: string;
  value: string;
  currentProfile: Partial<UserProfile>;
  message: string;
}

export interface WeatherRadarResult {
  city: string;
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  rainChance: string;
  visibilityKm: number;
  advisory: string;
  hourlyForecast: Array<{
    time: string;
    temp: string;
    condition: string;
  }>;
}

export interface HotelBookingResult {
  destination: string;
  checkIn: string;
  hotels: Array<{
    name: string;
    stars: number;
    pricePerNight: string;
    rating: number;
    amenities: string[];
    location: string;
    badge?: string;
  }>;
  recommendedHotel: string;
}

export interface CurrencyConverterResult {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: number;
  exchangeRate: number;
  formattedResult: string;
  feeEstimate: string;
}

export interface SmartChecklistResult {
  tripType: string;
  destination: string;
  weatherContext: string;
  totalItems: number;
  categories: Array<{
    categoryName: string;
    items: Array<{
      item: string;
      essential: boolean;
      packed: boolean;
    }>;
  }>;
  proactiveTip: string;
}

export interface TrainCoachPositionResult {
  trainNumber: string;
  trainName: string;
  platform: string;
  coaches: Array<{
    code: string;
    classType: string;
    positionFromEngine: number;
  }>;
  passengerCoach?: string;
  walkingTip: string;
}

export interface SmartConciergeResult {
  greeting: string;
  currentTime: string;
  dayPhase: 'morning' | 'afternoon' | 'evening' | 'night';
  weatherHighlight: {
    city: string;
    temp: string;
    condition: string;
    rainChance: string;
    transitNote: string;
  };
  commuteRecommendation: {
    suggestedRoute: string;
    pickup: string;
    destination: string;
    preferredFleet: string;
    estimatedFare: string;
    trafficStatus: string;
  };
  priorityEvents: Array<{
    title: string;
    time: string;
    category: string;
    status: string;
  }>;
  suggestedActionPills: string[];
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'forge';
  text: string;
  time: string;
  model?: 'p1' | 'p2';
  execution?: ToolCallExecution;
  followUpSuggestions?: string[];
  reasoningTrace?: ReasoningTrace;
  userFeedback?: 'positive' | 'negative';
}

export interface FewShotExample {
  id: string;
  userPrompt: string;
  expectedTool: string;
  expectedArgs: Record<string, any>;
  naturalResponse: string;
  tags: string[];
  difficulty: 'direct' | 'contextual' | 'ambiguous' | 'multi_turn';
}

export interface FewShotDataset {
  version: string;
  lastUpdated: string;
  totalExamples: number;
  examples: FewShotExample[];
}

export interface IntentConfidenceScore {
  intent: string;
  confidence: number;
  matchedEntities: Record<string, any>;
  isDisambiguationRequired: boolean;
  alternativeIntents: Array<{ intent: string; confidence: number }>;
}

export interface ToolCallExecution {
  id: string;
  toolName: string;
  args: any;
  status: 'pending' | 'success' | 'failed';
  result?: CabBookingResult | TrainStatusResult | FlightStatusResult | CalendarEventResult | PriceLookupResult | ForgeBasicsResult | UserMemoryResult | WeatherRadarResult | HotelBookingResult | CurrencyConverterResult | SmartChecklistResult | TrainCoachPositionResult | SmartConciergeResult | any;
  executedAt: string;
  confidence?: number;
  reasoningDurationMs?: number;
}

export type CognitiveStepType = 'intent_classification' | 'entity_extraction' | 'memory_retrieval' | 'few_shot_matching' | 'tool_selection' | 'safety_evaluation' | 'response_synthesis';

export interface CognitiveStep {
  step: CognitiveStepType;
  label: string;
  detail: string;
  durationMs: number;
  confidence: number;
  tokensUsed?: number;
}

export interface ReasoningTrace {
  traceId: string;
  query: string;
  timestamp: string;
  selectedModel: 'p1' | 'p2';
  steps: CognitiveStep[];
  totalLatencyMs: number;
  primaryIntent: string;
  overallConfidence: number;
}

export interface PromptTuningPreset {
  temperature: number;
  topP: number;
  topK: number;
  reasoningDepth: 'rapid' | 'balanced' | 'deep_chain';
  fewShotDensity: 'minimal' | 'balanced' | 'exhaustive';
  autoCorrectionLevel: 'strict' | 'adaptive';
}

export interface ModelEvaluationMetrics {
  totalInferences: number;
  averageLatencyMs: number;
  toolCallAccuracyPercent: number;
  intentRecognitionRate: number;
  fewShotCacheHitRate: number;
  lastTunedAt: string;
}
