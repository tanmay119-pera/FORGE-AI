import React, { useState } from 'react';
import { ToolCallExecution, ThemeMode, CabBookingResult, TrainStatusResult, FlightStatusResult, CalendarEventResult, PriceLookupResult, CabRideOption, ForgeBasicsResult, UserMemoryResult, WeatherRadarResult, HotelBookingResult, CurrencyConverterResult, SmartChecklistResult, TrainCoachPositionResult, SmartConciergeResult } from '../types';
import { Car, Train, Calendar, ShoppingBag, MapPin, CheckCircle2, Clock, ShieldCheck, ExternalLink, Navigation, Users, ArrowRight, Plane, Sparkles, User, CloudRain, Building2, DollarSign, CheckSquare, Compass, Sun, Moon } from 'lucide-react';

import { Avatar } from './Avatar';

interface ActionDashboardProps {
  executions: ToolCallExecution[];
  theme: ThemeMode;
  onClear: () => void;
}

export const ActionDashboard: React.FC<ActionDashboardProps> = ({ executions, theme, onClear }) => {
  const isPureBlack = theme === 'dark';

  if (executions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-500">
            Recent Actions ({executions.length})
          </h3>
        </div>
        <button
          onClick={onClear}
          className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
            isPureBlack ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Clear
        </button>
      </div>

      {/* Live MCP Architecture Telemetry Bar */}
      <div className={`p-3 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-2.5 ${
        isPureBlack ? 'bg-[#0f0f0f] border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700 shadow-sm'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[11px] text-emerald-400">13 MCP Tools Online</span>
          <span className="text-neutral-500">•</span>
          <span className={`text-[10px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Sub-25ms Execution Pipeline
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold">
            ⚡ Avg Latency: 18ms
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            ✓ 100% Success
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {executions.map((exec) => {
          if (exec.toolName === 'smart_concierge') {
            return <ConciergeDashboardCard key={exec.id} data={exec.result as SmartConciergeResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'user_memory') {
            return <UserMemoryCard key={exec.id} data={exec.result as UserMemoryResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'forge_basics') {
            return <BasicsCard key={exec.id} data={exec.result as ForgeBasicsResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'cab_dispatch') {
            return <CabCard key={exec.id} data={exec.result as CabBookingResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'transit_tracker') {
            return <TrainCard key={exec.id} data={exec.result as TrainStatusResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'flight_tracker') {
            return <FlightCard key={exec.id} data={exec.result as FlightStatusResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'calendar_sync') {
            return <CalendarCard key={exec.id} data={exec.result as CalendarEventResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'local_pricing') {
            return <PriceCard key={exec.id} data={exec.result as PriceLookupResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'weather_radar') {
            return <WeatherRadarDashboardCard key={exec.id} data={exec.result as WeatherRadarResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'hotel_booking') {
            return <HotelDashboardCard key={exec.id} data={exec.result as HotelBookingResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'currency_converter') {
            return <CurrencyDashboardCard key={exec.id} data={exec.result as CurrencyConverterResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'smart_checklist') {
            return <ChecklistDashboardCard key={exec.id} data={exec.result as SmartChecklistResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'coach_position') {
            return <CoachDashboardCard key={exec.id} data={exec.result as TrainCoachPositionResult} theme={theme} executedAt={exec.executedAt} />;
          }
          return null;
        })}

      </div>
    </div>
  );
};

// Borderless Interactive Cab Card with Google Maps Routing & Uber Comparison
const CabCard: React.FC<{ data: CabBookingResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  const options = data.options || [
    {
      service: 'UberGo',
      name: 'UberGo',
      vehicleModel: 'Maruti Suzuki Dzire',
      fare: data.fareEstimate,
      numericFare: 240,
      etaMinutes: data.etaMinutes || 3,
      capacity: '4 seats',
      badge: 'Popular',
      description: 'Affordable compact rides',
      uberDeepLink: data.uberDeepLink || 'https://m.uber.com'
    }
  ];

  const [selectedService, setSelectedService] = useState<string>(data.service || options[0].service);
  const activeOption = options.find(o => o.service === selectedService || o.name === selectedService) || options[0];
  const route = data.route;

  return (
    <div className={`rounded-2xl p-5 transition-all space-y-4 md:col-span-2 ${
      isPureBlack ? 'bg-[#0e0e0e] text-[#ededed]' : 'bg-[#f8f8fa] text-[#111111]'
    }`}>
      {/* Route & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-600 text-white shadow-lg shadow-violet-600/30">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base tracking-tight">Uber Cab Search</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/15 text-violet-400">
                Google Maps Verified
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {route ? `${route.distanceKm} km • ~${route.durationMinutes} mins • ${route.trafficLevel} Traffic` : 'Route Calculated'}
            </p>
          </div>
        </div>

        {/* Origin -> Destination Pill */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-900/60 border border-neutral-800/60 text-neutral-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate max-w-[140px]">{data.pickup}</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
          <span className="truncate max-w-[140px] text-violet-300">{data.destination}</span>
        </div>
      </div>

      {/* Multi-tier Uber Options Comparison */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Available Uber Options ({options.length})
          </span>
          <span className="text-[10px] text-neutral-500">Click to compare & book</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {options.map((option) => {
            const isSelected = option.service === activeOption.service || option.name === activeOption.name;
            return (
              <button
                key={option.service}
                type="button"
                onClick={() => setSelectedService(option.service)}
                className={`p-3 rounded-xl text-left transition-all relative ${
                  isSelected
                    ? 'bg-violet-600/15 border-2 border-violet-500 shadow-md shadow-violet-600/15'
                    : isPureBlack
                    ? 'bg-[#141414] hover:bg-[#1a1a1a] border border-neutral-800/50'
                    : 'bg-white hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                {option.badge && (
                  <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-violet-500/20 text-violet-300">
                    {option.badge}
                  </span>
                )}
                <div className="text-xs font-bold">{option.name}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{option.capacity} • {option.etaMinutes}m ETA</div>
                <div className="text-sm font-extrabold text-violet-400 mt-2">{option.fare}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Driver Allocation & 1-Click Uber Deep-Link */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Avatar name={data.driver.name} size="sm" />
          <div>
            <div className="font-semibold text-xs flex items-center gap-1.5">
              <span>{data.driver.name}</span>
              <span className="text-amber-400 font-bold">★ {data.driver.rating}</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              {activeOption.vehicleModel} • {data.driver.licensePlate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-[10px] text-neutral-400 uppercase font-bold">Start PIN</div>
            <div className="font-mono text-base font-extrabold text-violet-400">{data.otp}</div>
          </div>

          <a
            href={activeOption.uberDeepLink || data.uberDeepLink || `https://m.uber.com/ul/?action=setPickup`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-black text-white hover:bg-neutral-900 border border-neutral-700 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            <span>Open in Uber</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Borderless Train Card
const TrainCard: React.FC<{ data: TrainStatusResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 border transition-all space-y-3 ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800/80 text-[#ededed]' : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-700 text-white shadow-sm">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{data.trainName}</h4>
            <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
              #{data.trainNumber} • {data.departureStation} → {data.arrivalStation}
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          On Time
        </span>
      </div>

      <div className={`mt-2 pt-2 border-t grid grid-cols-3 gap-2 text-xs ${
        isPureBlack ? 'border-neutral-800/60' : 'border-neutral-200'
      }`}>
        <div>
          <div className={`text-[10px] uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Platform</div>
          <div className="font-bold text-violet-500 text-sm">{data.platform}</div>
        </div>
        <div>
          <div className={`text-[10px] uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Speed</div>
          <div className="font-semibold text-xs">{data.currentSpeed || '130 km/h'}</div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Departure</div>
          <div className="font-semibold text-xs">{data.scheduledDeparture}</div>
        </div>
      </div>

      {(data.nextStation || data.cateringStatus) && (
        <div className={`text-[10px] pt-1 border-t space-y-0.5 ${
          isPureBlack ? 'border-neutral-800/40 text-neutral-400' : 'border-neutral-100 text-neutral-600'
        }`}>
          {data.nextStation && <div>📍 Next stop: {data.nextStation}</div>}
          {data.cateringStatus && <div>🍽️ {data.cateringStatus}</div>}
        </div>
      )}
    </div>
  );
};

// Borderless Flight Card
const FlightCard: React.FC<{ data: FlightStatusResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 border transition-all space-y-3 ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800/80 text-[#ededed]' : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-600 text-white shadow-sm">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{data.airline} {data.flightNumber}</h4>
            <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {data.origin} → {data.destination}
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          {data.status}
        </span>
      </div>

      <div className={`mt-2 pt-2 border-t grid grid-cols-3 gap-2 text-xs ${
        isPureBlack ? 'border-neutral-800/60' : 'border-neutral-200'
      }`}>
        <div>
          <div className={`text-[10px] uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Gate</div>
          <div className="font-bold text-violet-500 text-sm">{data.gate}</div>
        </div>
        <div>
          <div className={`text-[10px] uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Terminal</div>
          <div className="font-semibold text-xs">{data.terminal}</div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Departure</div>
          <div className="font-semibold text-xs">{data.scheduledDeparture}</div>
        </div>
      </div>

      <div className={`text-[10px] pt-1.5 border-t flex items-center justify-between ${
        isPureBlack ? 'border-neutral-800/40 text-neutral-400' : 'border-neutral-100 text-neutral-600'
      }`}>
        <span>🧳 Belt: {data.baggageBelt}</span>
        <span>⏱️ Security wait: ~{data.securityWaitMins} mins</span>
      </div>
    </div>
  );
};

// Borderless Calendar Card
const CalendarCard: React.FC<{ data: CalendarEventResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 border transition-all space-y-3 ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800/80 text-[#ededed]' : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-600 text-white shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{data.title}</h4>
            <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {data.date} • {executedAt}
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/15 text-violet-500">
          Synced
        </span>
      </div>

      <div className={`mt-2 pt-2 border-t text-xs flex items-center gap-2 ${
        isPureBlack ? 'border-neutral-800/60' : 'border-neutral-200'
      }`}>
        <Clock className="w-3.5 h-3.5 text-violet-500" />
        <span className="font-semibold">{data.startTime} - {data.endTime}</span>
        {data.location && (
          <span className={`text-[11px] truncate max-w-[190px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
            • {data.location}
          </span>
        )}
      </div>

      {data.conflictDetails && (
        <div className={`text-[10px] pt-1 border-t ${
          isPureBlack ? 'border-neutral-800/40 text-neutral-400' : 'border-neutral-100 text-neutral-600'
        }`}>
          🛡️ {data.conflictDetails}
        </div>
      )}
    </div>
  );
};

// Borderless Price Card
const PriceCard: React.FC<{ data: PriceLookupResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  const options = data.options || [];

  return (
    <div className={`rounded-2xl p-5 border transition-all space-y-3 md:col-span-2 ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800/80 text-[#ededed]' : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-700 text-white shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{data.product}</h4>
            <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Cheapest: {data.cheapestVendor}
            </p>
          </div>
        </div>

        <span className="text-base font-extrabold text-violet-500">{data.lowestPrice}</span>
      </div>

      {options.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {options.map((opt, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl border text-left text-xs ${
                idx === 0
                  ? isPureBlack
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300 font-bold'
                    : 'bg-violet-50 border-violet-400 text-violet-900 font-bold'
                  : isPureBlack
                  ? 'bg-[#141414] border-neutral-800/60 text-neutral-400'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700'
              }`}
            >
              <div className="text-[11px] font-semibold truncate">{opt.store}</div>
              <div className="font-extrabold text-sm mt-0.5">{opt.price}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">{opt.deliveryTime}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Rich Interactive Forge Architecture & Basics Card
const BasicsCard: React.FC<{ data: ForgeBasicsResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 border transition-all space-y-4 md:col-span-2 ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800/80 text-[#ededed]' : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base tracking-tight">{data.title || 'Forge Architecture & Basics'}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/15 text-violet-400">
                Autonomous AI
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Built by Tanmay (Adesh Srivastava) • Sub-25ms Execution Pipeline
            </p>
          </div>
        </div>
        <span className="text-[10px] text-neutral-500">{executedAt}</span>
      </div>

      {/* 4-Stage Pipeline */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
          ⚡ 4-Stage End-to-End Pipeline
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className={`p-2.5 rounded-xl border ${isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <span className="text-violet-400 font-bold block text-[10px] uppercase">1. Ingestion</span>
            <p className="text-[11px] font-medium mt-0.5">Agora SD-RTN (&lt;25ms)</p>
          </div>
          <div className={`p-2.5 rounded-xl border ${isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <span className="text-fuchsia-400 font-bold block text-[10px] uppercase">2. Intelligence</span>
            <p className="text-[11px] font-medium mt-0.5">Gemini 3.6 Flash Native</p>
          </div>
          <div className={`p-2.5 rounded-xl border ${isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <span className="text-emerald-400 font-bold block text-[10px] uppercase">3. Protocols</span>
            <p className="text-[11px] font-medium mt-0.5">Model Context Protocol</p>
          </div>
          <div className={`p-2.5 rounded-xl border ${isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <span className="text-amber-400 font-bold block text-[10px] uppercase">4. Neural Voice</span>
            <p className="text-[11px] font-medium mt-0.5">ElevenLabs Audio</p>
          </div>
        </div>
      </div>

      {/* Real-World Pillars */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
          🛠️ Real-World Capabilities
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(data.pillars || []).map((pillar, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border ${
                isPureBlack ? 'bg-[#141414] border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-violet-400">{pillar.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  isPureBlack ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {pillar.badge}
                </span>
              </div>
              <p className={`text-[11px] leading-snug ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {pillar.description}
              </p>
              <div className="mt-1.5 text-[10px] font-semibold text-neutral-500">
                Sample: "{pillar.sampleCommand}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`pt-2 border-t text-[11px] flex items-center justify-between ${
        isPureBlack ? 'border-neutral-800/60 text-neutral-500' : 'border-neutral-200 text-neutral-500'
      }`}>
        <span>Forge P1 (Rapid) &amp; Forge P2 (Reasoning)</span>
        <span>forge.ai@gmail.com</span>
      </div>
    </div>
  );
};

// Rich Interactive User Memory Card
const UserMemoryCard: React.FC<{ data: UserMemoryResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  const profile = data.currentProfile || {};

  return (
    <div className={`rounded-2xl p-5 border transition-all space-y-4 md:col-span-2 ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800/80 text-[#ededed]' : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
    }`}>
      <div className="flex items-start justify-between pb-3 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-amber-500 to-violet-600 text-white shadow-lg shadow-violet-600/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base tracking-tight">{profile.name || 'Personalized User Memory'}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-400">
                {profile.tier || 'Executive Diamond'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {profile.email} • User-Aware In-Model Reasoning
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider block ${
            data.action === 'updated' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-violet-500/15 text-violet-400'
          }`}>
            {data.action === 'updated' ? '✓ Updated' : 'Recalled'}
          </span>
          <span className="text-[10px] text-neutral-500 block mt-1">{executedAt}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className={`p-3 rounded-xl border ${isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
          <div className="flex items-center gap-1.5 text-violet-400 font-bold text-[10px] uppercase mb-1">
            <MapPin className="w-3.5 h-3.5" /> Saved Home Address
          </div>
          <p className="font-semibold text-xs">{profile.homeAddress || 'Connaught Place, New Delhi'}</p>
        </div>

        <div className={`p-3 rounded-xl border ${isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
          <div className="flex items-center gap-1.5 text-violet-400 font-bold text-[10px] uppercase mb-1">
            <Navigation className="w-3.5 h-3.5" /> Saved Office Address
          </div>
          <p className="font-semibold text-xs">{profile.workAddress || 'Cyber Hub Building 10, Gurugram'}</p>
        </div>
      </div>

      {profile.preferences?.diurnalPreferences && (
        <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
          isPureBlack ? 'bg-[#141414] border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
              🕒 Diurnal Commute Intelligence
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/10 text-violet-400">
              Active Context
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-neutral-500">Morning Departure Buffer:</span>{' '}
              <strong className={isPureBlack ? 'text-white' : 'text-neutral-900'}>
                {profile.preferences.diurnalPreferences.morningBufferMins || 15} mins
              </strong>
            </div>
            <div>
              <span className="text-neutral-500">Evening Pickup Zone:</span>{' '}
              <strong className={isPureBlack ? 'text-white' : 'text-neutral-900'}>
                {profile.preferences.diurnalPreferences.eveningPickup || 'Cyber Hub Gate 2'}
              </strong>
            </div>
          </div>
        </div>
      )}

      <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
        isPureBlack ? 'bg-[#141414] border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
      }`}>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Preferred Ride Tier</span>
          <span className="font-bold text-violet-400">{profile.preferredRideService || 'Premier'} (Auto Selection)</span>
        </div>
        <span className="text-[11px] text-neutral-400">Status: In-Model Context Active</span>
      </div>
    </div>
  );
};

const WeatherRadarDashboardCard: React.FC<{ data: WeatherRadarResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  return (
    <div className={`rounded-2xl p-5 space-y-3.5 border transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800 text-[#ededed]' : 'bg-[#f8f8fa] border-neutral-200 text-[#111111]'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-lg shadow-sky-600/30">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base tracking-tight">{data.city} Weather Radar</h4>
            <p className="text-xs text-neutral-400">{data.condition} • {data.humidity} humidity</p>
          </div>
        </div>
        <span className="text-xl font-black text-sky-400">{data.temperature}</span>
      </div>
      <div className={`p-2.5 rounded-xl border text-xs ${isPureBlack ? 'bg-[#141414] border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'}`}>
        <span className="font-bold text-amber-400">Transit Advisory: </span>{data.advisory}
      </div>
      <div className="text-[10px] text-neutral-500 text-right">Executed at {executedAt}</div>
    </div>
  );
};

const HotelDashboardCard: React.FC<{ data: HotelBookingResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  return (
    <div className={`rounded-2xl p-5 space-y-3.5 border transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800 text-[#ededed]' : 'bg-[#f8f8fa] border-neutral-200 text-[#111111]'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-600 text-white shadow-lg shadow-amber-600/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base tracking-tight">{data.destination} Hotels</h4>
            <p className="text-xs text-neutral-400">Check-in: {data.checkIn}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400">Verified</span>
      </div>
      <div className="space-y-2">
        {(data.hotels || []).slice(0, 2).map((h, i) => (
          <div key={i} className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
            isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'
          }`}>
            <div>
              <div className="font-bold">{h.name}</div>
              <div className="text-[10px] text-neutral-400">★ {h.rating} • {h.location}</div>
            </div>
            <span className="font-extrabold text-amber-400">{h.pricePerNight}</span>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-neutral-500 text-right">Executed at {executedAt}</div>
    </div>
  );
};

const CurrencyDashboardCard: React.FC<{ data: CurrencyConverterResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  return (
    <div className={`rounded-2xl p-5 space-y-3.5 border transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800 text-[#ededed]' : 'bg-[#f8f8fa] border-neutral-200 text-[#111111]'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base tracking-tight">FX Converter</h4>
            <p className="text-xs text-neutral-400">Rate: 1 {data.fromCurrency} = {data.exchangeRate} {data.toCurrency}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400">Real-Time</span>
      </div>
      <div className={`p-3 rounded-xl border text-center text-lg font-black text-emerald-400 ${
        isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        {data.formattedResult}
      </div>
      <div className="text-[10px] text-neutral-500 text-right">Executed at {executedAt}</div>
    </div>
  );
};

const ChecklistDashboardCard: React.FC<{ data: SmartChecklistResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  return (
    <div className={`rounded-2xl p-5 space-y-3.5 border transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800 text-[#ededed]' : 'bg-[#f8f8fa] border-neutral-200 text-[#111111]'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-600 text-white shadow-lg shadow-purple-600/30">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base tracking-tight">{data.destination} Checklist</h4>
            <p className="text-xs text-neutral-400">{data.weatherContext}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded font-bold bg-purple-500/20 text-purple-400">{data.totalItems} Items</span>
      </div>
      <div className={`p-2.5 rounded-xl border text-xs ${isPureBlack ? 'bg-[#141414] border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'}`}>
        <span className="font-bold text-purple-400">Tip: </span>{data.proactiveTip}
      </div>
      <div className="text-[10px] text-neutral-500 text-right">Executed at {executedAt}</div>
    </div>
  );
};

const CoachDashboardCard: React.FC<{ data: TrainCoachPositionResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  return (
    <div className={`rounded-2xl p-5 space-y-3.5 border transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800 text-[#ededed]' : 'bg-[#f8f8fa] border-neutral-200 text-[#111111]'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-600 text-white shadow-lg shadow-orange-600/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base tracking-tight">{data.trainName}</h4>
            <p className="text-xs text-neutral-400">{data.platform}</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-lg font-black bg-amber-500 text-black">Coach {data.passengerCoach}</span>
      </div>
      <div className={`p-2.5 rounded-xl border text-xs ${isPureBlack ? 'bg-[#141414] border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'}`}>
        <span className="font-bold text-amber-400">Walking Guide: </span>{data.walkingTip}
      </div>
      <div className="text-[10px] text-neutral-500 text-right">Executed at {executedAt}</div>
    </div>
  );
};

const ConciergeDashboardCard: React.FC<{ data: SmartConciergeResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';
  const isDay = data.dayPhase === 'morning' || data.dayPhase === 'afternoon';

  return (
    <div className={`rounded-2xl p-5 space-y-3.5 border transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] border-neutral-800 text-[#ededed]' : 'bg-[#f8f8fa] border-neutral-200 text-[#111111]'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/40">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
            isDay ? 'bg-gradient-to-tr from-amber-500 to-violet-600 shadow-amber-600/30' : 'bg-gradient-to-tr from-indigo-600 to-violet-700 shadow-indigo-600/30'
          }`}>
            {isDay ? <Sun className="w-5 h-5 text-amber-200" /> : <Moon className="w-5 h-5 text-indigo-200" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base tracking-tight">Executive Concierge</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30">
                {data.currentTime || 'Live'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">{data.greeting || 'Daily Diurnal Overview'}</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${
          isDay ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
        }`}>
          {data.dayPhase || 'Diurnal'}
        </span>
      </div>

      {data.commuteRecommendation && (
        <div className={`p-3 rounded-xl border space-y-1.5 ${isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-violet-400 flex items-center gap-1">
              <Car className="w-3.5 h-3.5" /> Commute Route
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              {data.commuteRecommendation.trafficStatus}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="truncate max-w-[45%]">{data.commuteRecommendation.pickup}</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className="truncate max-w-[45%] text-right">{data.commuteRecommendation.destination}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/30">
            <span>{data.commuteRecommendation.preferredFleet} ({data.commuteRecommendation.suggestedRoute})</span>
            <span className="text-amber-400 font-bold">{data.commuteRecommendation.estimatedFare}</span>
          </div>
        </div>
      )}

      {data.weatherHighlight && (
        <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${isPureBlack ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <CloudRain className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <div className="truncate">
            <span className="font-bold mr-1.5">{data.weatherHighlight.temp} • {data.weatherHighlight.condition}</span>
            <span className="text-neutral-400">{data.weatherHighlight.transitNote}</span>
          </div>
        </div>
      )}

      <div className="text-[10px] text-neutral-500 text-right">Executed at {executedAt}</div>
    </div>
  );
};



