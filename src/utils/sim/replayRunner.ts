import type { VoiceState } from "../../types.ts";
import { nextVoiceState } from "./voiceTurnSimulator.ts";
export function replayVoiceLifecycle(events: Array<"start_mic" | "end_speech" | "run_tool" | "speak" | "reset">): VoiceState {
  return events.reduce<VoiceState>((state, ev) => nextVoiceState(state, ev), "idle");
}
