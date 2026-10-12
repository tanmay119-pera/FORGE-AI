export type CopilotIntent = "cab_booking" | "flight_status" | "train_status" | "calendar_event" | "general_query";

export function classifyVoiceIntent(transcript: string): CopilotIntent {
  const q = transcript.toLowerCase();
  if (/\b(cab|uber|ola|taxi|ride|pickup)\b/.test(q)) return "cab_booking";
  if (/\b(flight|airline|boarding|gate)\b/.test(q)) return "flight_status";
  if (/\b(train|pnr|platform|railway)\b/.test(q)) return "train_status";
  if (/\b(meeting|schedule|calendar|reminder|invite)\b/.test(q)) return "calendar_event";
  return "general_query";
}
