import { MCPToolDefinition, CabBookingResult, TrainStatusResult, FlightStatusResult, CalendarEventResult, PriceLookupResult, ForgeBasicsResult, UserMemoryResult } from '../types';

export const MCP_TOOLS: MCPToolDefinition[] = [
  {
    name: 'user_memory',
    description: 'Recalls, manages, or updates personalized user preferences, saved locations (homeAddress, workAddress), preferredRideService, and frequent travel routes.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          description: 'Memory action: "get" to inspect saved profile memory, "set" to update a preference or address',
          enum: ['get', 'set']
        },
        key: {
          type: 'string',
          description: 'Attribute key: "homeAddress", "workAddress", "preferredRideService", "quietRide", or "frequentDestinations"',
          enum: ['homeAddress', 'workAddress', 'preferredRideService', 'quietRide', 'frequentDestinations', 'all']
        },
        value: {
          type: 'string',
          description: 'The new value to store when action is "set"'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'forge_basics',
    description: 'Explains the system fundamentals, core architecture, real-world tools, and sample voice commands of Forge AI.',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Focus area: "overview", "architecture", "tools", or "commands"',
          enum: ['overview', 'architecture', 'tools', 'commands']
        }
      }
    }
  },
  {
    name: 'cab_dispatch',
    description: 'Books a rideshare or taxi cab (Uber / Ola) to a destination with real-time driver allocation and ETA tracking.',
    parameters: {
      type: 'object',
      properties: {
        pickup: {
          type: 'string',
          description: 'Pickup address or current location name (e.g. "Green Park, New Delhi" or "My current location")'
        },
        destination: {
          type: 'string',
          description: 'Destination location or landmark (e.g. "New Delhi Railway Station" or "Terminal 3 Airport")'
        },
        vehicle_type: {
          type: 'string',
          description: 'Vehicle tier preference: "UberGo", "Premier", "UberXL", "Auto", or "UberBlack"',
          enum: ['UberGo', 'Premier', 'UberXL', 'Auto', 'UberBlack']
        }
      },
      required: ['pickup', 'destination']
    }
  },
  {
    name: 'transit_tracker',
    description: 'Checks real-time train status, delay tracking, scheduled platform, speed, and PNR status for express and superfast trains.',
    parameters: {
      type: 'object',
      properties: {
        train_query: {
          type: 'string',
          description: 'Train name or train number (e.g. "Vande Bharat Express", "Shatabdi Express", "12004", "Rajdhani Express")'
        },
        departure_station: {
          type: 'string',
          description: 'Origin or departure station code / city name'
        }
      },
      required: ['train_query']
    }
  },
  {
    name: 'flight_tracker',
    description: 'Tracks live airport flight status, terminal gate, departure/arrival schedules, security wait time, and baggage carousel.',
    parameters: {
      type: 'object',
      properties: {
        flight_query: {
          type: 'string',
          description: 'Flight number or airline (e.g. "IndiGo 6E-204", "Air India 102", "AI 804", "Vistara UK-992")'
        },
        departure_city: {
          type: 'string',
          description: 'Departure airport or city'
        }
      },
      required: ['flight_query']
    }
  },
  {
    name: 'calendar_sync',
    description: 'Schedules an event, boarding reminder, or calendar sync on Google Calendar with conflict checking.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Event title (e.g. "Boarding Shatabdi Express", "Client Strategy Review")'
        },
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD or relative like "today", "tomorrow"'
        },
        time: {
          type: 'string',
          description: 'Time string (e.g. "18:15", "6:15 PM")'
        },
        duration_minutes: {
          type: 'number',
          description: 'Duration in minutes, default 30'
        },
        category: {
          type: 'string',
          description: 'Event category',
          enum: ['travel', 'meeting', 'reminder', 'task']
        }
      },
      required: ['title', 'time']
    }
  },
  {
    name: 'local_pricing',
    description: 'Scans local quick-commerce hubs (Blinkit, Zepto, Swiggy Instamart, Amazon Prime) for real-time item prices and delivery speeds.',
    parameters: {
      type: 'object',
      properties: {
        item_name: {
          type: 'string',
          description: 'Item or commodity to look up (e.g. "iPhone 15 Charger", "Sony WH-1000XM5", "Dark Roast Coffee")'
        },
        urgency: {
          type: 'string',
          description: 'Speed preference',
          enum: ['instant_10min', 'same_day', 'best_price']
        }
      },
      required: ['item_name']
    }
  }
];

// Execution simulators that return rich realistic side effects
export async function executeMCPTool(name: string, args: Record<string, any>): Promise<any> {
  // Ultra-fast response latency (50ms instead of 600ms to remove perceived lag)
  await new Promise(resolve => setTimeout(resolve, 50));

  switch (name) {
    case 'user_memory': {
      const action = args.action || 'get';
      const key = args.key || 'all';
      const value = args.value ? String(args.value).trim() : '';

      let savedUser: any = null;
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('forge_user');
        if (raw) {
          try { savedUser = JSON.parse(raw); } catch (e) {}
        }
      }
      if (!savedUser) {
        savedUser = {
          name: 'Tanmay (Adesh Srivastava)',
          email: 'forge.ai@gmail.com',
          avatar: '',
          provider: 'google',
          tier: 'Executive Diamond',
          homeAddress: 'Connaught Place, New Delhi',
          workAddress: 'Cyber Hub Building 10, Gurugram',
          preferredRideService: 'Premier',
          frequentDestinations: ['Indira Gandhi Airport Terminal 3', 'Central Railway Station Platform 4'],
          preferences: { quietRide: true, autoConfirmThreshold: '₹800' }
        };
      }

      if (action === 'set' && key && value) {
        if (key === 'homeAddress') savedUser.homeAddress = value;
        else if (key === 'workAddress') savedUser.workAddress = value;
        else if (key === 'preferredRideService') savedUser.preferredRideService = value;
        else if (key === 'frequentDestinations') {
          if (!savedUser.frequentDestinations) savedUser.frequentDestinations = [];
          if (!savedUser.frequentDestinations.includes(value)) savedUser.frequentDestinations.push(value);
        } else if (key === 'quietRide') {
          if (!savedUser.preferences) savedUser.preferences = {};
          savedUser.preferences.quietRide = value.toLowerCase() === 'true';
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('forge_user', JSON.stringify(savedUser));
        }

        const result: UserMemoryResult = {
          action: 'updated',
          key,
          value,
          currentProfile: savedUser,
          message: `Personalized memory updated: ${key} set to "${value}".`
        };
        return result;
      }

      const result: UserMemoryResult = {
        action: 'recalled',
        key: key || 'all',
        value: savedUser[key] || JSON.stringify(savedUser),
        currentProfile: savedUser,
        message: `Personalized user profile loaded for ${savedUser.name}. Home: ${savedUser.homeAddress || 'Connaught Place'}, Work: ${savedUser.workAddress || 'Cyber Hub'}, Preferred Cab: ${savedUser.preferredRideService || 'Premier'}.`
      };
      return result;
    }

    case 'forge_basics': {
      const result: ForgeBasicsResult = {
        title: 'Forge Autonomous AI Architecture',
        creator: 'Tanmay (Adesh Srivastava)',
        tagline: 'Conversational Voice AI with Model Context Protocol (MCP) Real-World Tool Calling',
        pipeline: {
          voiceIngestion: 'Real-time Agora SD-RTN / Web Speech (<25ms audio stream)',
          intelligence: 'Gemini 3.6 Flash Native Tools Function Calling',
          executionProtocol: 'Model Context Protocol (MCP) Real-Time Server Dispatch',
          speechOutput: 'ElevenLabs Neural Speech Synthesis Engine'
        },
        pillars: [
          {
            name: 'Cab Dispatch',
            description: '5-tier Uber fleet with Google Maps routing, verified drivers, OTP PIN & booking links',
            sampleCommand: 'Book an Uber Premier to Central Station Platform 4 Gate',
            badge: 'Uber + Google Maps'
          },
          {
            name: 'Transit Tracker',
            description: 'Live train tracking (Vande Bharat, Shatabdi, Rajdhani) with speed, platforms & delays',
            sampleCommand: 'Check Vande Bharat Express live train status and platform',
            badge: 'Indian Railways'
          },
          {
            name: 'Flight Radar',
            description: 'Airport flight departures (IndiGo, Air India, Emirates), terminal gates & security wait times',
            sampleCommand: 'Track IndiGo flight 6E-204 status and gate',
            badge: 'Airport Radar'
          },
          {
            name: 'Calendar Sync',
            description: 'Google Calendar event creation, Google Meet conference links & travel buffers',
            sampleCommand: 'Schedule boarding reminder on Google Calendar at 6:15 PM',
            badge: 'Google Workspace'
          },
          {
            name: 'Quick Commerce Pricing',
            description: 'Instant price comparison & delivery speeds across Blinkit, Zepto, Swiggy & Amazon',
            sampleCommand: 'Research price of Apple 30W Fast Charger across Blinkit',
            badge: 'Quick Commerce'
          }
        ],
        models: {
          p1: 'Forge P1: Everyday rapid velocity, sub-25ms voice conversations & single-turn execution',
          p2: 'Forge P2: Deep multi-step reasoning, chained actions & extreme autonomous planning'
        }
      };
      return result;
    }

    case 'cab_dispatch': {
      const pickup = (args.pickup || 'Connaught Place, New Delhi').trim();
      const destination = (args.destination || 'Indira Gandhi Airport Terminal 3').trim();
      const vehicleType = args.vehicle_type || 'UberGo';

      // 1. Compute realistic distance and driving duration (simulated from Google Maps Platform routing)
      let distanceKm = 14.8;
      let durationMinutes = 28;
      let trafficLevel: 'Low' | 'Moderate' | 'Heavy' = 'Moderate';

      const combined = `${pickup} -> ${destination}`.toLowerCase();
      if (combined.includes('airport') || combined.includes('t3') || combined.includes('terminal 3') || combined.includes('aerocity') || combined.includes('delhi airport') || combined.includes('kempegowda')) {
        distanceKm = 19.4;
        durationMinutes = 34;
        trafficLevel = 'Moderate';
      } else if (combined.includes('station') || combined.includes('ndls') || combined.includes('railway') || combined.includes('cst') || combined.includes('nizamuddin')) {
        distanceKm = 9.8;
        durationMinutes = 24;
        trafficLevel = 'Heavy';
      } else if (combined.includes('cyber hub') || combined.includes('gurgaon') || combined.includes('noida') || combined.includes('bkc') || combined.includes('indiranagar')) {
        distanceKm = 24.5;
        durationMinutes = 46;
        trafficLevel = 'Heavy';
      } else if (combined.includes('connaught') || combined.includes('cp') || combined.includes('central') || combined.includes('koramangala')) {
        distanceKm = 7.2;
        durationMinutes = 16;
        trafficLevel = 'Low';
      } else {
        const hash = Array.from(combined).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        distanceKm = Number((6.2 + (hash % 160) / 10).toFixed(1));
        durationMinutes = Math.max(14, Math.round(distanceKm * 2.1));
        trafficLevel = distanceKm > 15 ? 'Heavy' : 'Moderate';
      }

      // Generate official Uber universal deep link
      const uberDeepLink = `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickup)}&dropoff[formatted_address]=${encodeURIComponent(destination)}`;

      // Calculate fares for all 5 Uber tiers based on distance & base rates
      const autoFare = Math.max(55, Math.round(35 + distanceKm * 9.8));
      const goFare = Math.max(119, Math.round(55 + distanceKm * 15.2));
      const premierFare = Math.max(179, Math.round(85 + distanceKm * 22.5));
      const xlFare = Math.max(269, Math.round(140 + distanceKm * 32.0));
      const blackFare = Math.max(450, Math.round(220 + distanceKm * 48.0));

      const options = [
        {
          service: 'Auto',
          name: 'Uber Auto',
          vehicleModel: 'Bajaj RE Auto Rickshaw',
          fare: `₹${autoFare}`,
          numericFare: autoFare,
          etaMinutes: 2,
          capacity: '3 seats',
          badge: 'Best Value',
          description: 'Quick, pocket-friendly rides without traffic delays',
          uberDeepLink
        },
        {
          service: 'UberGo',
          name: 'UberGo',
          vehicleModel: 'Maruti Suzuki Dzire / WagonR',
          fare: `₹${goFare}`,
          numericFare: goFare,
          etaMinutes: 3,
          capacity: '4 seats',
          badge: 'Most Popular',
          description: 'Affordable, compact rides with AC & clean interior',
          uberDeepLink
        },
        {
          service: 'Premier',
          name: 'Uber Premier',
          vehicleModel: 'Hyundai Verna / Honda City',
          fare: `₹${premierFare}`,
          numericFare: premierFare,
          etaMinutes: 4,
          capacity: '4 seats',
          badge: 'Executive',
          description: 'Comfortable sedans with top-rated 5★ drivers',
          uberDeepLink
        },
        {
          service: 'UberXL',
          name: 'UberXL',
          vehicleModel: 'Toyota Innova Crysta / Ertiga',
          fare: `₹${xlFare}`,
          numericFare: xlFare,
          etaMinutes: 6,
          capacity: '6 seats',
          badge: 'Extra Space',
          description: 'Spacious SUVs for team travel and airport luggage',
          uberDeepLink
        },
        {
          service: 'UberBlack',
          name: 'Uber Black Exec',
          vehicleModel: 'BMW 3-Series / Hyundai Ioniq 5 EV',
          fare: `₹${blackFare}`,
          numericFare: blackFare,
          etaMinutes: 7,
          capacity: '4 luxury',
          badge: 'VIP Tier',
          description: 'Luxury executive travel with professional chauffeur',
          uberDeepLink
        }
      ];

      const selectedTier = options.find(o => o.service.toLowerCase() === vehicleType.toLowerCase()) || options[1]; // default UberGo

      const booking: CabBookingResult = {
        bookingId: 'UBER-' + Math.floor(100000 + Math.random() * 900000),
        service: selectedTier.name,
        pickup,
        destination,
        route: {
          origin: pickup,
          destination,
          distanceKm,
          durationMinutes,
          trafficLevel
        },
        options,
        driver: {
          name: 'Rajesh Sharma',
          rating: 4.96,
          carModel: selectedTier.vehicleModel,
          licensePlate: 'DL 01 EB 4892',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          phone: '+91 98102 XXXXX',
          trips: 4850,
          languages: 'English, Hindi'
        },
        etaMinutes: selectedTier.etaMinutes,
        fareEstimate: selectedTier.fare,
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        status: 'arriving',
        uberDeepLink,
        tollIncluded: true,
        surgeMultiplier: '1.0x (Standard Fare)',
        paymentMethod: 'Apple Pay / Google Pay / Cash'
      };
      return booking;
    }

    case 'transit_tracker': {
      const query = (args.train_query || 'Vande Bharat Express').toLowerCase();
      const isShatabdi = query.includes('shatabdi');
      const isVandeBharat = query.includes('vande') || query.includes('bharat') || query.includes('22436') || query.includes('20641');
      const isRajdhani = query.includes('rajdhani') || query.includes('12423');
      const isGatimaan = query.includes('gatimaan') || query.includes('12050');
      const isTejas = query.includes('tejas') || query.includes('82502');

      const trainNumber = isVandeBharat ? '22436' : isShatabdi ? '12004' : isRajdhani ? '12423' : isGatimaan ? '12050' : isTejas ? '82502' : '12628';
      const trainName = isVandeBharat
        ? 'New Delhi - Varanasi Vande Bharat Express'
        : isShatabdi
        ? 'Lucknow Shatabdi Express'
        : isRajdhani
        ? 'Dibrugarh Rajdhani Superfast Express'
        : isGatimaan
        ? 'Gatimaan Express (Semi-High Speed 160 km/h)'
        : isTejas
        ? 'Lucknow - New Delhi Tejas Express'
        : 'Karnataka Express Superfast';

      const train: TrainStatusResult = {
        trainNumber,
        trainName,
        departureStation: args.departure_station || 'NDLS (New Delhi Central)',
        arrivalStation: isVandeBharat ? 'BSB (Varanasi Junction)' : isShatabdi ? 'LKO (Lucknow Charbagh)' : isGatimaan ? 'AGC (Agra Cantt)' : 'SBC (Bengaluru City)',
        scheduledDeparture: isVandeBharat ? '06:00' : isShatabdi ? '18:00' : '20:15',
        actualDeparture: isVandeBharat ? '06:02' : isShatabdi ? '18:05' : '20:18',
        statusText: 'Running On Time (Departing Platform 4)',
        delayMinutes: 3,
        platform: 'Platform 4',
        coachPosition: 'C-4 (Mid-Platform near Escalator 2)',
        pnr: '243-9842183 (Confirmed • Seat 42)',
        currentSpeed: isVandeBharat ? '130 km/h' : isGatimaan ? '155 km/h' : '110 km/h',
        nextStation: isVandeBharat ? 'Kanpur Central in 2h 45m' : 'Ghaziabad Junction in 22m',
        cateringStatus: 'Complimentary Hot Meal & Beverage Loaded'
      };
      return train;
    }

    case 'flight_tracker': {
      const query = (args.flight_query || 'IndiGo 6E-204').toUpperCase();
      const isAirIndia = query.includes('AI') || query.includes('AIR INDIA');
      const isEmirates = query.includes('EK') || query.includes('EMIRATES');
      const isVistara = query.includes('UK') || query.includes('VISTARA');

      const flightNumber = isAirIndia ? 'AI 102' : isEmirates ? 'EK 512' : isVistara ? 'UK 992' : '6E 204';
      const airline = isAirIndia ? 'Air India' : isEmirates ? 'Emirates' : isVistara ? 'Air India Express' : 'IndiGo Airlines';

      const flight: FlightStatusResult = {
        flightNumber,
        airline,
        origin: args.departure_city || 'DEL (Indira Gandhi Intl T3)',
        destination: isEmirates ? 'DXB (Dubai International T3)' : isAirIndia ? 'JFK (New York JFK T4)' : 'BOM (Mumbai Chhatrapati Shivaji T2)',
        scheduledDeparture: '19:45',
        estimatedDeparture: '19:50',
        terminal: 'Terminal 3 (T3)',
        gate: 'Gate 34B (Near Duty Free)',
        baggageBelt: 'Belt 08',
        status: 'On Time',
        securityWaitMins: 8
      };
      return flight;
    }

    case 'calendar_sync': {
      const now = new Date();
      const timeStr = args.time || '18:30';
      const event: CalendarEventResult = {
        eventId: 'cal-' + Date.now().toString(36),
        title: args.title || 'Executive Strategy Sync & Travel Review',
        date: args.date || now.toISOString().split('T')[0],
        startTime: timeStr,
        endTime: '19:00',
        location: args.location || 'Google Meet • meet.google.com/for-geai-copilot',
        category: (args.category as any) || 'travel',
        attendees: ['tanmay@forge.ai', 'forge.ai@gmail.com', 'executive@team.corp'],
        hasConflict: false,
        conflictDetails: 'No calendar conflicts. 45-min buffer retained before departure.'
      };
      return event;
    }

    case 'local_pricing': {
      const item = args.item_name || 'Apple 30W USB-C Fast Charger';
      const result: PriceLookupResult = {
        product: item,
        category: 'Quick Commerce & Fast Delivery',
        cheapestVendor: 'Blinkit Instant (8 mins)',
        lowestPrice: '₹1,449',
        averagePrice: '₹1,799',
        options: [
          {
            store: 'Blinkit Instant',
            price: '₹1,449',
            deliveryTime: '8 mins (Live Stock)',
            inStock: true,
            rating: 4.9
          },
          {
            store: 'Zepto Quick',
            price: '₹1,499',
            deliveryTime: '10 mins (Flash Deal)',
            inStock: true,
            rating: 4.8
          },
          {
            store: 'Swiggy Instamart',
            price: '₹1,549',
            deliveryTime: '12 mins',
            inStock: true,
            rating: 4.7
          },
          {
            store: 'Amazon Prime Now',
            price: '₹1,699',
            deliveryTime: 'Today by 8 PM',
            inStock: true,
            rating: 4.9
          }
        ]
      };
      return result;
    }

    default:
      throw new Error(`Tool not found: ${name}`);
  }
}

