export interface TraceSpan { name: string; startMs: number; endMs: number; }
export function spanDuration(span: TraceSpan): number { return Math.max(0, span.endMs - span.startMs); }
export function totalTraceTime(spans: TraceSpan[]): number { return spans.reduce((s, sp) => s + spanDuration(sp), 0); }
