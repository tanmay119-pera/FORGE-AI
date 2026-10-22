import type { VoiceState } from "../../types.ts";
export function nextVoiceState(current: VoiceState, event: "start_mic" | "end_speech" | "run_tool" | "speak" | "reset"): VoiceState {
  if (event === "reset") return "idle";
  if (current === "idle" && event === "start_mic") return "listening";
  if (current === "listening" && event === "end_speech") return "thinking";
  if (current === "thinking" && event === "run_tool") return "executing";
  if ((current === "thinking" || current === "executing") && event === "speak") return "speaking";
  return current;
}
