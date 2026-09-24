import React from 'react';
import { ToolCallExecution, ThemeMode, CabBookingResult, TrainStatusResult, CalendarEventResult, PriceLookupResult } from '../types';
import { Car, Train, Calendar, ShoppingBag, MapPin, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">
            Recent Actions ({executions.length})
          </h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs px-2.5 py-1 rounded-full text-neutral-400 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {executions.map((exec) => {
          if (exec.toolName === 'cab_dispatch') {
            return <CabCard key={exec.id} data={exec.result as CabBookingResult} theme={theme} executedAt={exec.executedAt} />;
          } else if (exec.toolName === 'transit_tracker') {
            return <TrainCard key={exec.id} data={exec.result as TrainStatusResult} theme={theme} executedAt={exec.executedAt} />;
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

// Borderless Cab Card
const CabCard: React.FC<{ data: CabBookingResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] text-[#ededed]' : 'bg-[#f8f8fa] text-[#111111]'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-600 text-white">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm">{data.service}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-violet-500/15 text-violet-400">
                Booked
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">{executedAt}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-extrabold text-violet-400">{data.fareEstimate}</span>
          <div className="text-[10px] text-neutral-400">Fixed</div>
        </div>
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Avatar name={data.driver.name} size="sm" />
          <div>
            <div className="font-semibold text-xs">{data.driver.name} ★ {data.driver.rating}</div>
            <div className="text-[11px] text-neutral-400">{data.driver.carModel} • {data.driver.licensePlate}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-neutral-400 uppercase font-bold">OTP</div>
          <div className="font-mono text-base font-extrabold text-violet-400">{data.otp}</div>
        </div>
      </div>
    </div>
  );
};

// Borderless Train Card
const TrainCard: React.FC<{ data: TrainStatusResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] text-[#ededed]' : 'bg-[#f8f8fa] text-[#111111]'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-700 text-white">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{data.trainName}</h4>
            <p className="text-[11px] text-neutral-400">#{data.trainNumber} • {executedAt}</p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-400">
          On Time
        </span>
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between text-xs">
        <div>
          <div className="text-[10px] text-neutral-400 uppercase font-bold">Platform</div>
          <div className="font-bold text-violet-400">{data.platform}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-neutral-400 uppercase font-bold">Recommended</div>
          <div>{data.coachPosition}</div>
        </div>
      </div>
    </div>
  );
};

// Borderless Calendar Card
const CalendarCard: React.FC<{ data: CalendarEventResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] text-[#ededed]' : 'bg-[#f8f8fa] text-[#111111]'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-600 text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{data.title}</h4>
            <p className="text-[11px] text-neutral-400">{executedAt}</p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/15 text-violet-400">
          Synced
        </span>
      </div>

      <div className="mt-3 text-xs flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-violet-400" />
        <span>{data.startTime} - {data.endTime}</span>
      </div>
    </div>
  );
};

// Borderless Price Card
const PriceCard: React.FC<{ data: PriceLookupResult; theme: ThemeMode; executedAt: string }> = ({ data, theme, executedAt }) => {
  const isPureBlack = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 transition-all ${
      isPureBlack ? 'bg-[#0e0e0e] text-[#ededed]' : 'bg-[#f8f8fa] text-[#111111]'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-700 text-white">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{data.product}</h4>
            <p className="text-[11px] text-neutral-400">{data.cheapestVendor}</p>
          </div>
        </div>

        <span className="text-base font-extrabold text-violet-400">{data.lowestPrice}</span>
      </div>
    </div>
  );
};
