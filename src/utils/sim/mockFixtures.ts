import type { RouteSummary, FlightStatusResult } from "../../types.ts";
export const SAMPLE_ROUTE: RouteSummary = { origin: "Campus", destination: "Airport", distanceKm: 28.4, durationMinutes: 42, trafficLevel: "Moderate" };
export const SAMPLE_FLIGHT: FlightStatusResult = { flightNumber: "AI-302", airline: "Air India", origin: "DEL", destination: "BLR", scheduledDeparture: "14:00", estimatedDeparture: "14:15", terminal: "T3", gate: "G12", baggageBelt: "4", status: "On Time", securityWaitMins: 14 };
