import { MCPToolDefinition, CabBookingResult, TrainStatusResult, CalendarEventResult, PriceLookupResult } from '../types';

export const MCP_TOOLS: MCPToolDefinition[] = [
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
          description: 'Vehicle tier preference: "UberGo", "Premier", "UberXL", or "Auto"',
          enum: ['UberGo', 'Premier', 'UberXL', 'Auto']
        }
      },
      required: ['destination']
    }
  },
  {
    name: 'transit_tracker',
    description: 'Checks real-time train status, delay tracking, scheduled platform, and PNR status for express and superfast trains.',
    parameters: {
      type: 'object',
      properties: {
        train_query: {
          type: 'string',
          description: 'Train name or train number (e.g. "Vande Bharat Express", "Shatabdi Express", "12004")'
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
    description: 'Scans local supermarkets, pharmacies, or e-commerce delivery hubs (Blinkit, Zepto, Amazon) for current item prices.',
    parameters: {
      type: 'object',
      properties: {
        item_name: {
          type: 'string',
          description: 'Item or commodity to look up (e.g. "iPhone 15 Charger", "Sony WH-1000XM5", "Organic Almonds 500g")'
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
  // Simulate standard network latency for MCP RPC
  await new Promise(resolve => setTimeout(resolve, 600));

  switch (name) {
    case 'cab_dispatch': {
      const destination = args.destination || 'New Delhi Railway Station';
      const pickup = args.pickup || 'Current Location';
      const vehicleType = args.vehicle_type || 'Premier';

      const booking: CabBookingResult = {
        bookingId: 'UBER-' + Math.floor(100000 + Math.random() * 900000),
        service: `Uber ${vehicleType}`,
        pickup,
        destination,
        driver: {
          name: 'Rajesh Sharma',
          rating: 4.92,
          carModel: vehicleType === 'UberXL' ? 'Toyota Innova Crysta (White)' : 'Hyundai Ioniq 5 Electric (Silver)',
          licensePlate: 'DL 01 EB 4892',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          phone: '+91 98102 XXXXX'
        },
        etaMinutes: Math.floor(3 + Math.random() * 4),
        fareEstimate: vehicleType === 'UberXL' ? '₹480' : vehicleType === 'Auto' ? '₹140' : '₹320',
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        status: 'arriving'
      };
      return booking;
    }

    case 'transit_tracker': {
      const query = (args.train_query || 'Vande Bharat Express').toLowerCase();
      const isShatabdi = query.includes('shatabdi');
      const isVandeBharat = query.includes('vande') || query.includes('bharat');

      const train: TrainStatusResult = {
        trainNumber: isVandeBharat ? '22436' : isShatabdi ? '12004' : '12423',
        trainName: isVandeBharat ? 'Vande Bharat Express' : isShatabdi ? 'Lucknow Shatabdi Express' : 'Rajdhani Superfast Express',
        departureStation: args.departure_station || 'NDLS (New Delhi)',
        arrivalStation: isVandeBharat ? 'BSB (Varanasi Junction)' : 'LKO (Lucknow Charbagh)',
        scheduledDeparture: '18:00',
        actualDeparture: '18:05',
        statusText: 'Running On Time (Departing Platform 4)',
        delayMinutes: 5,
        platform: 'Platform 4',
        coachPosition: 'C-4 (Near Mid-Escalator)',
        pnr: '243-9842183'
      };
      return train;
    }

    case 'calendar_sync': {
      const now = new Date();
      const timeStr = args.time || '18:30';
      const event: CalendarEventResult = {
        eventId: 'cal-' + Date.now().toString(36),
        title: args.title || 'Boarding Train Reminder',
        date: args.date || now.toISOString().split('T')[0],
        startTime: timeStr,
        endTime: '19:00',
        location: args.location || 'New Delhi Central Station',
        category: (args.category as any) || 'travel',
        attendees: ['you@personal.me', 'assistant@aura.ai'],
        hasConflict: false
      };
      return event;
    }

    case 'local_pricing': {
      const item = args.item_name || 'iPhone 15 Fast Charger 30W';
      const result: PriceLookupResult = {
        product: item,
        category: 'Electronics & Fast Delivery',
        cheapestVendor: 'Blinkit Instant (8 mins)',
        lowestPrice: '₹1,499',
        averagePrice: '₹1,899',
        options: [
          {
            store: 'Blinkit Instant',
            price: '₹1,499',
            deliveryTime: '8 mins',
            inStock: true,
            rating: 4.8
          },
          {
            store: 'Zepto Quick',
            price: '₹1,549',
            deliveryTime: '11 mins',
            inStock: true,
            rating: 4.7
          },
          {
            store: 'Amazon Prime Local',
            price: '₹1,699',
            deliveryTime: 'Today by 9 PM',
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
