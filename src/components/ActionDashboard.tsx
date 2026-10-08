import React, { useState } from 'react';
import { ToolCallExecution, ThemeMode, CabBookingResult, TrainStatusResult, FlightStatusResult, CalendarEventResult, PriceLookupResult, CabRideOption, ForgeBasicsResult } from '../types';
import { Car, Train, Calendar, ShoppingBag, MapPin, CheckCircle2, Clock, ShieldCheck, ExternalLink, Navigation, Users, ArrowRight, Plane, Sparkles } from 'lucide-react';
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {executions.map((exec) => {
          if (exec.toolName === 'forge_basics') {
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

