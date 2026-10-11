const DEFAULT_ALIASES: Record<string, string> = {
  uber: "book_cab",
  taxi: "book_cab",
  cab: "book_cab",
  flight: "check_flight_status",
  train: "check_train_status",
  meeting: "schedule_calendar_event",
};

export function resolveToolAlias(spokenIntent: string): string {
  const norm = spokenIntent.trim().toLowerCase();
  return DEFAULT_ALIASES[norm] || norm;
}
