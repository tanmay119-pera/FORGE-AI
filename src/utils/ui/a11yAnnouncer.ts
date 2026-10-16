export interface A11yAnnouncement { message: string; priority: "polite" | "assertive"; }
export class A11yAnnouncerQueue {
  private history: A11yAnnouncement[] = [];
  announce(message: string, priority: "polite" | "assertive" = "polite"): boolean {
    const trimmed = message.trim();
    if (!trimmed) return false;
    if (this.history[this.history.length - 1]?.message === trimmed) return false;
    this.history.push({ message: trimmed, priority });
    return true;
  }
  latest(): A11yAnnouncement | undefined { return this.history[this.history.length - 1]; }
}
