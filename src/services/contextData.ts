export interface JourneyDetails {
  tripId: string;
  routeTitle: string;
  origin: string;
  destination: string;
  distanceKm: number;
  remainingKm: number;
  currentSpeedKmH: number;
  weather: {
    originTemp: string;
    destTemp: string;
    condition: string;
  };
  train: {
    trainNumber: string;
    name: string;
    pnr: string;
    classType: string;
    coach: string;
    seat: string;
    berthType: string;
    platform: string;
    gateEntry: string;
    departureTime: string;
    arrivalTime: string;
    delayMinutes: number;
    tteVerificationStatus: 'Verified' | 'Pending';
    mealPreference: string;
    stops: Array<{
      station: string;
      code: string;
      arrival: string;
      departure: string;
      haltMinutes: number;
      passed: boolean;
    }>;
  };
  cab: {
    bookingRef: string;
    serviceType: string;
    pickupLocation: string;
    pickupLandmark: string;
    driver: {
      name: string;
      phone: string;
      rating: number;
      totalTrips: number;
      joinedYears: number;
      avatar: string;
      carName: string;
      licensePlate: string;
      color: string;
    };
    etaMinutes: number;
    distanceMeters: number;
    fare: {
      base: number;
      toll: number;
      taxes: number;
      total: number;
      paymentMethod: string;
    };
    otp: string;
    driverLastMessage: string;
    driverMessageTime: string;
  };
  agenda: Array<{
    id: string;
    time: string;
    duration: string;
    title: string;
    location: string;
    status: 'completed' | 'in_progress' | 'upcoming';
    category: 'briefing' | 'logistics' | 'travel' | 'checkin';
    note?: string;
  }>;
  procurement: Array<{
    id: string;
    item: string;
    hub: string;
    distance: string;
    etaMinutes: number;
    price: string;
    mrp: string;
    savings: string;
    stock: string;
    rider?: string;
  }>;
  audioTelemetry: {
    channel: string;
    sessionId: string;
    codec: string;
    sampleRate: string;
    bitrate: string;
    rttMs: number;
    jitterMs: number;
    packetLossPct: number;
    aecStatus: string;
    ansReductionDb: number;
    agcLevelLufs: number;
    turnaroundTotalMs: number;
  };
}

export const ACTIVE_JOURNEY_CONTEXT: JourneyDetails = {
  tripId: 'TRIP-DEL-BSB-2026-0924',
  routeTitle: 'New Delhi Executive Corridor → Varanasi Cantt',
  origin: 'New Delhi (NDLS)',
  destination: 'Varanasi Junction (BSB)',
  distanceKm: 759,
  remainingKm: 759,
  currentSpeedKmH: 0,
  weather: {
    originTemp: '28°C',
    destTemp: '26°C',
    condition: 'Clear Sky • AQI 92'
  },
  train: {
    trainNumber: '22436',
    name: 'Vande Bharat Express',
    pnr: '243-9842183',
    classType: 'Executive Chair Car (EC)',
    coach: 'C-4',
    seat: '42',
    berthType: 'Window Side (Individual Recline)',
    platform: 'Platform 4',
    gateEntry: 'Ajmeri Gate Entry • Gate 2 Escalator directly to C-4',
    departureTime: '18:00',
    arrivalTime: '23:58',
    delayMinutes: 0,
    tteVerificationStatus: 'Verified',
    mealPreference: 'Vegetarian Executive Dinner (Hot meal booked)',
    stops: [
      { station: 'New Delhi', code: 'NDLS', arrival: 'Origin', departure: '18:00', haltMinutes: 0, passed: false },
      { station: 'Kanpur Central', code: 'CNB', arrival: '21:12', departure: '21:15', haltMinutes: 3, passed: false },
      { station: 'Prayagraj Junction', code: 'PRYJ', arrival: '22:30', departure: '22:32', haltMinutes: 2, passed: false },
      { station: 'Varanasi Junction', code: 'BSB', arrival: '23:58', departure: 'Terminates', haltMinutes: 0, passed: false }
    ]
  },
  cab: {
    bookingRef: 'UB-98412-PRM',
    serviceType: 'Uber Premier Electric',
    pickupLocation: 'Paharganj / Connaught Outer Circle',
    pickupLandmark: 'NDLS Station Gate 2 VIP Portico (Pillar B-4)',
    driver: {
      name: 'Rajesh Sharma',
      phone: '+91 98102 48921',
      rating: 4.92,
      totalTrips: 4821,
      joinedYears: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      carName: 'Hyundai Ioniq 5 Electric (AWD)',
      licensePlate: 'DL 01 EB 4892',
      color: 'Cyber Gray Metallic'
    },
    etaMinutes: 3,
    distanceMeters: 650,
    fare: {
      base: 180,
      toll: 60,
      taxes: 24,
      total: 320,
      paymentMethod: 'UPI Autopay (Google Pay linked)'
    },
    otp: '4892',
    driverLastMessage: 'Sir, I have entered Station VIP road. Hazards are on near Pillar B-4.',
    driverMessageTime: '1 min ago'
  },
  agenda: [
    {
      id: 'ag-1',
      time: '09:30 - 10:15 AM',
      duration: '45m',
      title: 'Sprint Architecture & Live Demo Review',
      location: 'Google Meet',
      status: 'completed',
      category: 'briefing',
      note: 'Aligned on Model Context Protocol tools & Agora low-latency audio.'
    },
    {
      id: 'ag-2',
      time: '01:00 - 02:00 PM',
      duration: '60m',
      title: 'Agora Voice AI SDK Technical Sync',
      location: 'HQ Conference Room A',
      status: 'completed',
      category: 'briefing',
      note: 'SD-RTN routing & acoustic echo cancellation verified.'
    },
    {
      id: 'ag-3',
      time: '05:15 - 05:30 PM',
      duration: '15m',
      title: 'Cab Pickup by Uber Premier',
      location: 'VIP Gate 2 Portico',
      status: 'in_progress',
      category: 'logistics',
      note: 'Driver Rajesh arriving in 3 mins. PIN: 4892.'
    },
    {
      id: 'ag-4',
      time: '05:40 - 05:55 PM',
      duration: '15m',
      title: 'Platform 4 Security & Coach C-4 Boarding',
      location: 'NDLS Platform 4 (Escalator 2)',
      status: 'upcoming',
      category: 'travel',
      note: '20 min travel buffer reserved to ensure zero stress.'
    },
    {
      id: 'ag-5',
      time: '06:00 - 11:58 PM',
      duration: '5h 58m',
      title: 'Vande Bharat Express Departure',
      location: 'Coach C-4 • Seat 42 (Window)',
      status: 'upcoming',
      category: 'travel',
      note: 'Meal service starts at 19:30 near Kanpur.'
    },
    {
      id: 'ag-6',
      time: '12:20 AM',
      duration: 'Check-in',
      title: 'Taj Ganges Hotel Check-in & Dinner',
      location: 'Nadesar Palace Grounds, Varanasi',
      status: 'upcoming',
      category: 'checkin',
      note: 'Confirmation #TG-881920. Late night dining confirmed.'
    }
  ],
  procurement: [
    {
      id: 'pr-1',
      item: 'Apple 30W USB-C Fast Charger',
      hub: 'Blinkit Okhla Tech Hub (1.8 km)',
      distance: '1.8 km',
      etaMinutes: 8,
      price: '₹1,499',
      mrp: '₹1,899',
      savings: 'Save ₹400 (21% off)',
      stock: '4 units left in local dark store',
      rider: 'Amit Kumar (EV Scooter #DL-4S-291)'
    },
    {
      id: 'pr-2',
      item: 'Bose QuietComfort 45 Active Noise-Cancelling',
      hub: 'Amazon Prime Local Hub (Connaught Place)',
      distance: '2.4 km',
      etaMinutes: 35,
      price: '₹18,990',
      mrp: '₹21,990',
      savings: 'Save ₹3,000 (14% off)',
      stock: '2 units in transit hub',
      rider: 'Priority Delivery Agent assigned'
    },
    {
      id: 'pr-3',
      item: 'Fast&Up Travel Hydration Electrolytes (10 Tabs)',
      hub: 'Zepto Express Paharganj (0.9 km)',
      distance: '0.9 km',
      etaMinutes: 7,
      price: '₹240',
      mrp: '₹290',
      savings: 'Save ₹50',
      stock: 'In stock',
      rider: 'Express Rider allocated'
    }
  ],
  audioTelemetry: {
    channel: 'forge-executive-912',
    sessionId: 'ag-live-89102-rtn',
    codec: 'Opus HD Full-Band (48 kHz)',
    sampleRate: '48,000 Hz / Stereo 2-Ch',
    bitrate: '48.2 kbps Adaptive',
    rttMs: 21,
    jitterMs: 1.1,
    packetLossPct: 0.0,
    aecStatus: 'Hardware Double-Talk AEC3 Active',
    ansReductionDb: 24,
    agcLevelLufs: -14.2,
    turnaroundTotalMs: 231
  }
};
