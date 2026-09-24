import React, { useState } from 'react';
import { ThemeMode, ToolCallExecution } from '../types';
import { ACTIVE_JOURNEY_CONTEXT, JourneyDetails } from '../services/contextData';
import {
  Car,
  Train,
  Calendar,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  Navigation,
  Radio,
  Wifi,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sliders,
  Sparkles,
  Zap,
  Volume2,
  Share2,
  AlertCircle
} from 'lucide-react';
import { Avatar } from './Avatar';

interface JourneyDashboardProps {
  theme: ThemeMode;
  executions: ToolCallExecution[];
}

export const JourneyDashboard: React.FC<JourneyDashboardProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'commute' | 'rail' | 'agenda' | 'market' | 'audio'>('commute');
  const isPureBlack = theme === 'dark';
  const data: JourneyDetails = ACTIVE_JOURNEY_CONTEXT;

  return (
    <div className="space-y-4">
      
      {/* 1. Journey Header & Route Context (Clean, human-crafted typography) */}
      <div className={`p-5 rounded-3xl transition-all ${
        isPureBlack ? 'bg-[#0a0a0a]' : 'bg-[#f8f8fa]'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full">
                Active Itinerary • {data.tripId}
              </span>
              <span className="text-xs text-neutral-400">• {data.weather.condition}</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white dark:text-white mt-1">
              {data.routeTitle}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Origin: {data.origin} ({data.weather.originTemp}) → Terminus: {data.destination} ({data.weather.destTemp}) • {data.distanceKm} km
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 text-violet-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>Buffer: 22m Safe Lead</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Seamless Section Tabs (Borderless, tactile pill switcher) */}
      <div className={`flex items-center gap-1 p-1 rounded-2xl overflow-x-auto scrollbar-none ${
        isPureBlack ? 'bg-[#0a0a0a]' : 'bg-[#f4f4f6]'
      }`}>
        {[
          { id: 'commute', label: 'Cab Logistics', icon: Car },
          { id: 'rail', label: 'Rail Telemetry', icon: Train },
          { id: 'agenda', label: 'Day Schedule', icon: Calendar },
          { id: 'market', label: 'Local Essentials', icon: ShoppingBag },
          { id: 'audio', label: 'Audio Engine', icon: Radio },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm'
                  : isPureBlack
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents with Deep Real-World Context */}

      {/* TAB 1: CAB LOGISTICS */}
      {activeTab === 'commute' && (
        <div className={`p-6 rounded-3xl space-y-5 transition-all ${
          isPureBlack ? 'bg-[#0a0a0a]' : 'bg-[#f8f8fa]'
        }`}>
          {/* Driver & Vehicle Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <Avatar name={data.cab.driver.name} size="lg" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[8px] text-white font-bold">
                  ✓
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">{data.cab.driver.name}</h3>
                  <span className="text-[11px] font-bold text-amber-400">★ {data.cab.driver.rating}</span>
                  <span className="text-[11px] text-neutral-400">({data.cab.driver.totalTrips.toLocaleString()} trips • {data.cab.driver.joinedYears}y Premier)</span>
                </div>
                <p className="text-xs text-neutral-300 font-medium mt-0.5">
                  {data.cab.driver.carName} • <span className="font-mono text-violet-400 font-bold">{data.cab.driver.licensePlate}</span> ({data.cab.driver.color})
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Ride Start PIN</span>
              <span className="font-mono text-xl font-extrabold text-violet-400 tracking-wider">
                {data.cab.otp}
              </span>
            </div>
          </div>

          {/* Real-time Driver Message Alert */}
          <div className={`p-3.5 rounded-2xl flex items-start gap-3 text-xs ${
            isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'
          }`}>
            <MessageSquare className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-violet-300">Driver Transmission</span>
                <span className="text-[10px] text-neutral-400">{data.cab.driverMessageTime}</span>
              </div>
              <p className="text-neutral-300 mt-0.5 italic">"{data.cab.driverLastMessage}"</p>
            </div>
          </div>

          {/* Vector Route Simulation */}
          <div className={`h-28 rounded-2xl overflow-hidden relative ${
            isPureBlack ? 'bg-[#050505]' : 'bg-[#e5e5ea]'
          }`}>
            <svg className="w-full h-full opacity-65" viewBox="0 0 400 110" preserveAspectRatio="none">
              <path d="M 10 90 Q 120 20, 240 70 T 390 35" fill="none" stroke={isPureBlack ? '#1e1e1e' : '#cbd5e1'} strokeWidth="12" />
              <path d="M 10 90 Q 120 20, 240 70 T 390 35" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6,4" />
            </svg>

            {/* Live GPS Marker */}
            <div className="absolute top-[48px] left-[58%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-violet-600 text-white text-[11px] px-3 py-1.5 rounded-full font-bold shadow-xl">
              <Car className="w-3.5 h-3.5 animate-pulse" />
              <span>{data.cab.distanceMeters}m away • ETA {data.cab.etaMinutes} mins (38 km/h)</span>
            </div>

            {/* Target Portico Pin */}
            <div className="absolute top-[24px] right-5 flex flex-col items-center">
              <MapPin className="w-5 h-5 text-red-500 drop-shadow" />
              <span className="text-[9px] font-bold text-white bg-black/70 px-1 rounded mt-0.5">Pillar B-4</span>
            </div>
          </div>

          {/* Pickup Landmark & Live Fare Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className={`p-4 rounded-2xl space-y-1.5 ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}>
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Pickup Protocol</div>
              <div className="font-bold text-neutral-200">{data.cab.pickupLandmark}</div>
              <p className="text-[11px] text-neutral-400">
                Driver instructed to keep emergency flashers active. Security pass cleared for station VIP lane.
              </p>
            </div>

            <div className={`p-4 rounded-2xl space-y-1.5 ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                <span>Fare Audit</span>
                <span className="text-violet-400 font-bold">₹{data.cab.fare.total}.00 Confirmed</span>
              </div>
              <div className="text-[11px] text-neutral-300 space-y-0.5">
                <div className="flex justify-between">
                  <span>Base Premier Fare</span>
                  <span>₹{data.cab.fare.base}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Station Commercial Toll</span>
                  <span>₹{data.cab.fare.toll}.00</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>GST & Green Transit Cess</span>
                  <span>₹{data.cab.fare.taxes}.00</span>
                </div>
              </div>
              <div className="pt-1.5 text-[10px] text-emerald-400 font-medium">
                ✓ {data.cab.fare.paymentMethod}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RAIL TELEMETRY & BOARDING */}
      {activeTab === 'rail' && (
        <div className={`p-6 rounded-3xl space-y-5 transition-all ${
          isPureBlack ? 'bg-[#0a0a0a]' : 'bg-[#f8f8fa]'
        }`}>
          {/* Train Identity & Class */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                  Train #{data.train.trainNumber}
                </span>
                <h3 className="font-bold text-base">{data.train.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                  On-Time Performance
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                PNR: <span className="font-mono text-neutral-200 font-bold">{data.train.pnr}</span> • {data.train.classType} • TTE Status: {data.train.tteVerificationStatus}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Seat Reservation</span>
              <span className="font-mono text-base font-extrabold text-violet-400">
                Coach {data.train.coach} • Seat {data.train.seat}
              </span>
              <div className="text-[10px] text-neutral-400">{data.train.berthType}</div>
            </div>
          </div>

          {/* Boarding Access & Escalator Guidance */}
          <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs ${
            isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Physical Navigation</span>
                <div className="font-bold text-neutral-200">{data.train.platform} — {data.train.gateEntry}</div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Walk 85 meters past Escalator 2. Coach C-4 halts adjacent to water pillar 14.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-violet-400 whitespace-nowrap hidden sm:inline">
              Meal: {data.train.mealPreference}
            </span>
          </div>

          {/* Halting Station Progress Timeline */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Route Schedule & Halts
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {data.train.stops.map((st, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-violet-400">{st.code}</span>
                    <span className="text-[10px] text-neutral-400">{st.haltMinutes > 0 ? `${st.haltMinutes}m halt` : 'Terminal'}</span>
                  </div>
                  <div className="font-semibold text-neutral-200 mt-1">{st.station}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Dep: {st.departure}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DAY SCHEDULE & BUFFER ENGINE */}
      {activeTab === 'agenda' && (
        <div className={`p-6 rounded-3xl space-y-4 transition-all ${
          isPureBlack ? 'bg-[#0a0a0a]' : 'bg-[#f8f8fa]'
        }`}>
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-bold text-sm">Synchronized Itinerary</h3>
              <p className="text-xs text-neutral-400">
                Automated schedule conflict audit verified with 20 min safe travel buffers
              </p>
            </div>
            <span className="text-xs font-bold text-violet-400">
              6 Context Events
            </span>
          </div>

          <div className="space-y-2.5">
            {data.agenda.map((item) => {
              const isPast = item.status === 'completed';
              const isCurrent = item.status === 'in_progress';
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl flex items-start justify-between text-xs transition-colors ${
                    isCurrent
                      ? isPureBlack ? 'bg-violet-950/25 border-l-2 border-violet-500' : 'bg-violet-50 border-l-2 border-violet-500'
                      : isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="font-mono text-xs font-bold text-violet-400 w-24 pt-0.5">
                      {item.time}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isPast ? 'text-neutral-400 line-through' : 'text-neutral-100'}`}>
                          {item.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white animate-pulse">
                            ACTIVE NOW
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {item.location} • {item.duration}
                      </div>
                      {item.note && (
                        <p className="text-[10px] text-neutral-400 mt-1 italic">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {item.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LOCAL PROCUREMENT */}
      {activeTab === 'market' && (
        <div className={`p-6 rounded-3xl space-y-4 transition-all ${
          isPureBlack ? 'bg-[#0a0a0a]' : 'bg-[#f8f8fa]'
        }`}>
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-bold text-sm">Nearby Dark Store Inventory (Within 2.5 km)</h3>
              <p className="text-xs text-neutral-400">
                Live dispatch telemetry via Model Context Protocol `local_pricing`
              </p>
            </div>
            <span className="text-xs text-violet-400 font-bold">Fast Dispatch</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.procurement.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl space-y-2 ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}
              >
                <div className="font-bold text-xs text-neutral-100">{p.item}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-violet-400">{p.price}</span>
                  <span className="text-xs text-neutral-400 line-through">{p.mrp}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">{p.savings}</div>
                <div className="text-[11px] text-neutral-400 pt-1">
                  {p.hub} • <span className="font-semibold text-neutral-300">ETA {p.etaMinutes}m</span>
                </div>
                {p.rider && (
                  <div className="text-[10px] text-neutral-400 italic pt-1 border-t border-neutral-800">
                    Rider: {p.rider}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIO ENGINE & TELEMETRY */}
      {activeTab === 'audio' && (
        <div className={`p-6 rounded-3xl space-y-4 transition-all ${
          isPureBlack ? 'bg-[#0a0a0a]' : 'bg-[#f8f8fa]'
        }`}>
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-bold text-sm">Agora SD-RTN Real-Time Voice Diagnostics</h3>
              <p className="text-xs text-neutral-400">
                Sub-frame latency audio transmission with hardware DSP beamforming
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold">● Active 48 kHz</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className={`p-3.5 rounded-2xl ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}>
              <div className="text-[10px] text-neutral-400 uppercase font-bold">Round Trip (RTT)</div>
              <div className="text-xl font-extrabold text-violet-400 mt-1">{data.audioTelemetry.rttMs} ms</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Jitter: {data.audioTelemetry.jitterMs}ms</div>
            </div>

            <div className={`p-3.5 rounded-2xl ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}>
              <div className="text-[10px] text-neutral-400 uppercase font-bold">Acoustic Echo (AEC)</div>
              <div className="text-base font-extrabold text-neutral-200 mt-1">AEC3 Active</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Hardware double-talk</div>
            </div>

            <div className={`p-3.5 rounded-2xl ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}>
              <div className="text-[10px] text-neutral-400 uppercase font-bold">Noise Suppression</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">-{data.audioTelemetry.ansReductionDb} dB</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Dual-mic beamforming</div>
            </div>

            <div className={`p-3.5 rounded-2xl ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}>
              <div className="text-[10px] text-neutral-400 uppercase font-bold">E2E Turnaround</div>
              <div className="text-xl font-extrabold text-violet-400 mt-1">{data.audioTelemetry.turnaroundTotalMs} ms</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Sub-second voice action</div>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl text-[11px] text-neutral-400 font-mono ${isPureBlack ? 'bg-[#121212]' : 'bg-[#ededf0]'}`}>
            Channel: {data.audioTelemetry.channel} • Session: {data.audioTelemetry.sessionId} • Codec: {data.audioTelemetry.codec} • Bitrate: {data.audioTelemetry.bitrate}
          </div>
        </div>
      )}

    </div>
  );
};
