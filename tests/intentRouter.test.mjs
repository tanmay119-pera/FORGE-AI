import test from "node:test";
import assert from "node:assert/strict";
import { classifyVoiceIntent } from "../src/utils/cognitive/intentRouter.ts";

test("classifyVoiceIntent routes natural commands to domain handlers", () => {
  assert.equal(classifyVoiceIntent("Book an Uber to terminal 3"), "cab_booking");
  assert.equal(classifyVoiceIntent("Check flight AI-302 boarding gate"), "flight_status");
  assert.equal(classifyVoiceIntent("What platform is my train arriving on?"), "train_status");
  assert.equal(classifyVoiceIntent("Schedule a team sync meeting at 4pm"), "calendar_event");
  assert.equal(classifyVoiceIntent("Explain black holes"), "general_query");
});
