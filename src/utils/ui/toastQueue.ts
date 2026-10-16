export interface ToastItem { id: string; text: string; kind: "info" | "success" | "error"; }
export class ToastQueue {
  private items: ToastItem[] = [];
  private maxItems: number;
  constructor(maxItems = 3) { this.maxItems = maxItems; }
  push(item: ToastItem): void {
    this.items.push(item);
    if (this.items.length > this.maxItems) this.items.shift();
  }
  dismiss(id: string): void { this.items = this.items.filter((i) => i.id !== id); }
  list(): ToastItem[] { return [...this.items]; }
}
