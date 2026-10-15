import { MCPToolDefinition, CabBookingResult, TrainStatusResult, FlightStatusResult, CalendarEventResult, PriceLookupResult, ForgeBasicsResult, UserMemoryResult, WeatherRadarResult, HotelBookingResult, CurrencyConverterResult, SmartChecklistResult, TrainCoachPositionResult, SmartConciergeResult } from '../types';

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
  },
  {
    name: 'weather_radar',
    description: 'Fetches live hyper-local weather conditions, rain forecast, visibility, and travel advisories for departure and destination cities.',
    parameters: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'City or destination name (e.g. "New Delhi", "Mumbai", "London", "Bengaluru")'
        },
        timeframe: {
          type: 'string',
          description: 'Forecast window: "current", "hourly", or "daily"',
          enum: ['current', 'hourly', 'daily']
        }
      },
      required: ['city']
    }
  },
  {
    name: 'hotel_booking',
    description: 'Searches executive, business, or luxury hotel accommodations near arrival stations, airports, or business districts with verified amenities and price per night.',
    parameters: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'City or area name (e.g. "Mumbai Bandra", "Bengaluru Whitefield", "London Heathrow", "New Delhi Connaught Place")'
        },
        check_in: {
          type: 'string',
          description: 'Check-in date (YYYY-MM-DD or relative like "today", "tomorrow")'
        },
        preference: {
          type: 'string',
          description: 'Hotel category preference: "luxury", "business", or "budget"',
          enum: ['luxury', 'business', 'budget']
        }
      },
      required: ['destination']
    }
  },
  {
    name: 'currency_converter',
    description: 'Calculates real-time foreign currency conversions, mid-market FX rates, and estimated overseas card fees for international and domestic travel.',
    parameters: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'Amount in source currency to convert (e.g. 500, 12000)'
        },
        from_currency: {
          type: 'string',
          description: 'Source 3-letter currency code (e.g. "USD", "INR", "EUR", "GBP", "AED", "SGD")'
        },
        to_currency: {
          type: 'string',
          description: 'Target 3-letter currency code (e.g. "INR", "USD", "EUR", "AED")'
        }
      },
      required: ['amount', 'from_currency', 'to_currency']
    }
  },
  {
    name: 'smart_checklist',
    description: 'Generates a contextual, intelligent packing and document checklist dynamically customized for destination climate, duration, and transit type.',
    parameters: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'Destination city or region (e.g. "Mumbai", "Kashmir", "Dubai", "Bengaluru")'
        },
        trip_type: {
          type: 'string',
          description: 'Purpose or style of trip: "business", "leisure", or "weekend"',
          enum: ['business', 'leisure', 'weekend']
        },
        duration_days: {
          type: 'number',
          description: 'Trip duration in days, default 3'
        }
      },
      required: ['destination']
    }
  },
  {
    name: 'coach_position',
    description: 'Looks up exact train rake layout, engine-to-guard coach ordering, platform placement, and passenger coach location for railway departures.',
    parameters: {
      type: 'object',
      properties: {
        train_query: {
          type: 'string',
          description: 'Train number or name (e.g. "12004", "Vande Bharat Express", "Shatabdi")'
        },
        coach_code: {
          type: 'string',
          description: 'Coach code if available (e.g. "C4", "B2", "E1", "A1")'
        }
      },
      required: ['train_query']
    }
  },
  {
    name: 'smart_concierge',
    description: 'Generates an executive daily briefing, multi-modal commute recommendations, live weather highlights, priority agenda sync, and proactive follow-up action pills.',
    parameters: {
      type: 'object',
      properties: {
        focus: {
          type: 'string',
          description: 'Briefing focus: "daily_overview", "commute_ready", "weather_transit", or "evening_wrap"',
          enum: ['daily_overview', 'commute_ready', 'weather_transit', 'evening_wrap']
        },
        location: {
          type: 'string',
          description: 'Current city or office location (e.g. "New Delhi", "Gurugram", "Mumbai")'
        }
      }
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

    case 'weather_radar': {

      const city = args.city || 'New Delhi';
      const cityLower = city.toLowerCase();
      const isRainy = cityLower.includes('mumbai') || cityLower.includes('goa') || cityLower.includes('london');
      const isHot = cityLower.includes('dubai') || cityLower.includes('chennai');
      const isCold = cityLower.includes('kashmir') || cityLower.includes('shimla') || cityLower.includes('manali');

      const temp = isCold ? '9°C' : isHot ? '36°C' : isRainy ? '27°C' : '28°C';
      const condition = isCold ? 'Chilly & Clear' : isRainy ? 'Scattered Showers' : isHot ? 'Sunny & Humid' : 'Partly Cloudy';
      const rainChance = isRainy ? '78%' : isHot ? '5%' : '15%';
      const advisory = isRainy 
        ? 'High probability of rain in afternoon. Allow +20 mins buffer for airport/station cab transit.'
        : 'Clear road visibility and normal transit speeds expected across the city.';

      const result: WeatherRadarResult = {
        city,
        temperature: temp,
        condition,
        humidity: isRainy ? '82%' : '54%',
        windSpeed: '14 km/h NW',
        rainChance,
        visibilityKm: isRainy ? 5.2 : 9.8,
        advisory,
        hourlyForecast: [
          { time: 'Now', temp, condition },
          { time: '+2h', temp: isCold ? '11°C' : '29°C', condition },
          { time: '+4h', temp: isCold ? '8°C' : '26°C', condition: isRainy ? 'Overcast' : 'Clear' },
          { time: '+6h', temp: isCold ? '6°C' : '24°C', condition: 'Clear Sky' }
        ]
      };
      return result;
    }

    case 'hotel_booking': {
      const destination = args.destination || 'Mumbai BKC';
      const checkIn = args.check_in || 'Today';
      const isLuxury = args.preference === 'luxury';
      const isBudget = args.preference === 'budget';

      const hotels = isLuxury ? [
        {
          name: 'The Oberoi & Trident Executive Suites',
          stars: 5,
          pricePerNight: '₹18,500/night',
          rating: 4.9,
          amenities: ['Club Lounge Access', 'Airport Chauffeur', 'High-Speed Fiber', '24/7 Butler'],
          location: `${destination} Central Hub`,
          badge: 'Forge Executive Choice'
        },
        {
          name: 'Taj Lands End Luxury Pavilion',
          stars: 5,
          pricePerNight: '₹16,200/night',
          rating: 4.8,
          amenities: ['Sea View', 'Executive Workspace', 'Spa & Pool', 'Breakfast Included'],
          location: `${destination} Waterfront`
        }
      ] : isBudget ? [
        {
          name: 'Ginger Smart Business Hotel',
          stars: 3,
          pricePerNight: '₹3,200/night',
          rating: 4.3,
          amenities: ['Express Check-in', 'Work Desk', 'Wi-Fi', 'Breakfast'],
          location: `${destination} Metro Link`,
          badge: 'Best Value'
        },
        {
          name: 'Bloomrooms @ City Center',
          stars: 3,
          pricePerNight: '₹3,800/night',
          rating: 4.4,
          amenities: ['Quiet Sleep Pod', 'Cloud Bed', 'Fast Wi-Fi'],
          location: `${destination} Central`
        }
      ] : [
        {
          name: 'Radisson Blu Plaza & Executive Suites',
          stars: 4,
          pricePerNight: '₹7,800/night',
          rating: 4.7,
          amenities: ['Airport Shuttle', 'Business Center', 'Buffet Breakfast', 'Ergonomic Desk'],
          location: `${destination} Transit Corridor`,
          badge: 'Most Popular'
        },
        {
          name: 'Courtyard by Marriott Business Bay',
          stars: 4,
          pricePerNight: '₹8,900/night',
          rating: 4.6,
          amenities: ['Meeting Rooms', 'Gym & Pool', 'Direct Metro Walk', 'Executive Lounge'],
          location: `${destination} Financial District`
        }
      ];

      const result: HotelBookingResult = {
        destination,
        checkIn,
        hotels,
        recommendedHotel: hotels[0].name
      };
      return result;
    }

    case 'currency_converter': {
      const amount = Number(args.amount) || 100;
      const from = String(args.from_currency || 'USD').toUpperCase();
      const to = String(args.to_currency || 'INR').toUpperCase();

      // Rates relative to USD
      const ratesToUSD: Record<string, number> = {
        USD: 1.0,
        INR: 0.0118,
        EUR: 1.09,
        GBP: 1.30,
        AED: 0.272,
        SGD: 0.76,
        JPY: 0.0067
      };

      const fromRate = ratesToUSD[from] || 1.0;
      const toRate = ratesToUSD[to] || 0.0118;
      const exchangeRate = Number((fromRate / toRate).toFixed(4));
      const convertedAmount = Number((amount * exchangeRate).toFixed(2));

      const symbolMap: Record<string, string> = {
        USD: '$',
        INR: '₹',
        EUR: '€',
        GBP: '£',
        AED: 'AED ',
        SGD: 'S$',
        JPY: '¥'
      };

      const toSymbol = symbolMap[to] || `${to} `;
      const fromSymbol = symbolMap[from] || `${from} `;

      const result: CurrencyConverterResult = {
        amount,
        fromCurrency: from,
        toCurrency: to,
        convertedAmount,
        exchangeRate,
        formattedResult: `${fromSymbol}${amount.toLocaleString()} = ${toSymbol}${convertedAmount.toLocaleString()}`,
        feeEstimate: 'Zero markup on Forge Corporate FX • Bank savings: ~2.4%'
      };
      return result;
    }

    case 'smart_checklist': {
      const destination = args.destination || 'Mumbai';
      const tripType = args.trip_type || 'business';
      const isRainy = destination.toLowerCase().includes('mumbai') || destination.toLowerCase().includes('monsoon');
      const isCold = destination.toLowerCase().includes('kashmir') || destination.toLowerCase().includes('shimla');

      const categories = [
        {
          categoryName: 'Travel & Identity Essentials',
          items: [
            { item: 'Government ID / Passport / Visa Copies', essential: true, packed: true },
            { item: 'Digital Boarding Pass & Confirmation PDF', essential: true, packed: true },
            { item: 'Corporate Credit Cards + Forex Card', essential: true, packed: false }
          ]
        },
        {
          categoryName: 'Tech & Electronics',
          items: [
            { item: 'Laptop + Fast GaN Charger', essential: true, packed: false },
            { item: 'Noise-Cancelling Headphones', essential: false, packed: true },
            { item: 'Universal Power Adapter & 10000mAh Power Bank', essential: true, packed: false }
          ]
        },
        {
          categoryName: isRainy ? 'Monsoon & Weather Gear' : isCold ? 'Cold Climate Essentials' : 'Apparel & Wardrobe',
          items: isRainy ? [
            { item: 'Compact Windproof Umbrella', essential: true, packed: false },
            { item: 'Waterproof Laptop Sleeve & Rain Cover', essential: true, packed: false },
            { item: 'Quick-dry Business Shirts', essential: false, packed: false }
          ] : isCold ? [
            { item: 'Down Jacket & Thermal Layers', essential: true, packed: false },
            { item: 'Woolen Socks & Gloves', essential: true, packed: false },
            { item: 'Moisturizer & Lip Balm', essential: false, packed: true }
          ] : [
            { item: 'Formal Executive Outfits (2 Pairs)', essential: true, packed: false },
            { item: 'Comfortable Walking Shoes', essential: true, packed: false },
            { item: 'Gym & Lounge Wear', essential: false, packed: false }
          ]
        }
      ];

      const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);

      const result: SmartChecklistResult = {
        tripType,
        destination,
        weatherContext: isRainy ? 'High Humidity & Intermittent Showers expected' : isCold ? 'Sub-10°C chilly conditions' : 'Mild & Temperate',
        totalItems,
        categories,
        proactiveTip: isRainy 
          ? 'Carry weather-resistant carry-on. Traffic in Mumbai increases travel time by 30% during precipitation.'
          : 'Pack light cabin baggage to bypass check-in queues on arrival.'
      };
      return result;
    }

    case 'coach_position': {
      const trainQuery = args.train_query || '12004 Lucknow Shatabdi';
      const passengerCoach = args.coach_code || 'C4';

      const coaches = [
        { code: 'ENG', classType: 'Electric WAP-7 Locomotive', positionFromEngine: 0 },
        { code: 'EOG', classType: 'End-on-Generation Power Car', positionFromEngine: 1 },
        { code: 'C1', classType: 'AC Chair Car', positionFromEngine: 2 },
        { code: 'C2', classType: 'AC Chair Car', positionFromEngine: 3 },
        { code: 'C3', classType: 'AC Chair Car', positionFromEngine: 4 },
        { code: 'C4', classType: 'AC Chair Car (Executive Reserve)', positionFromEngine: 5 },
        { code: 'E1', classType: 'Executive Class', positionFromEngine: 6 },
        { code: 'E2', classType: 'Executive Class', positionFromEngine: 7 },
        { code: 'C5', classType: 'AC Chair Car', positionFromEngine: 8 },
        { code: 'C6', classType: 'AC Chair Car', positionFromEngine: 9 },
        { code: 'C7', classType: 'AC Chair Car', positionFromEngine: 10 },
        { code: 'EOG', classType: 'Rear Generator Guard Van', positionFromEngine: 11 }
      ];

      const result: TrainCoachPositionResult = {
        trainNumber: '12004',
        trainName: trainQuery,
        platform: 'Platform 4 (North Side Escalator)',
        coaches,
        passengerCoach,
        walkingTip: `Coach ${passengerCoach} is situated 5th from the locomotive. Enter from Station Gate 2 and take Escalator 2 directly onto Platform 4.`
      };
      return result;
    }

    case 'smart_concierge': {
      const now = new Date();
      const hours = now.getHours();
      const isMorning = hours >= 5 && hours < 12;
      const isAfternoon = hours >= 12 && hours < 17;
      const isEvening = hours >= 17 && hours < 22;
      const dayPhase: 'morning' | 'afternoon' | 'evening' | 'night' = 
        isMorning ? 'morning' : isAfternoon ? 'afternoon' : isEvening ? 'evening' : 'night';

      let savedUser: any = null;
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('forge_user');
        if (raw) {
          try { savedUser = JSON.parse(raw); } catch (e) {}
        }
      }
      const userName = savedUser?.name || 'Tanmay (Adesh Srivastava)';
      const firstName = userName.split(' ')[0];
      const home = savedUser?.homeAddress || 'Connaught Place, New Delhi';
      const work = savedUser?.workAddress || 'Cyber Hub Building 10, Gurugram';
      const fleet = savedUser?.preferredRideService || 'Premier';

      const isCommuteToWork = isMorning;
      const pickup = isCommuteToWork ? home : work;
      const destination = isCommuteToWork ? work : home;

      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const result: SmartConciergeResult = {
        greeting: `Good ${dayPhase}, ${firstName}!`,
        currentTime: timeString,
        dayPhase,
        weatherHighlight: {
          city: 'New Delhi / NCR',
          temp: '26°C',
          condition: 'Clear Sky & Temperate',
          rainChance: '5%',
          transitNote: 'Clear conditions across highway corridors. No weather delays expected.'
        },
        commuteRecommendation: {
          suggestedRoute: isCommuteToWork ? 'Delhi-Gurgaon Expressway via NH48' : 'MG Road to Connaught Place',
          pickup,
          destination,
          preferredFleet: fleet,
          estimatedFare: '₹420',
          trafficStatus: 'Flowing smoothly (ETA ~26 mins)'
        },
        priorityEvents: [
          {
            title: isCommuteToWork ? 'Morning AI Systems Review' : 'Executive Strategy & Travel Sync',
            time: isCommuteToWork ? '10:30 AM' : '06:00 PM',
            category: 'meeting',
            status: 'Confirmed'
          },
          {
            title: 'Shatabdi Express Booking Gate Review',
            time: '07:15 PM',
            category: 'travel',
            status: 'Platform 4 Confirmed'
          }
        ],
        suggestedActionPills: [
          isCommuteToWork ? `Take me to work in an Uber ${fleet}` : `Take me home in an Uber ${fleet}`,
          'Check Vande Bharat live train status',
          'Check weather radar in Mumbai',
          'Create packing checklist for weekend'
        ]
      };
      return result;
    }

    default:
      throw new Error(`Tool not found: ${name}`);
  }
}






