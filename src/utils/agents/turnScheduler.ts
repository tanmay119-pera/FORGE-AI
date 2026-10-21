export interface QueuedTurn { id: string; text: string; priority: number; }
export class TurnScheduler {
  private queue: QueuedTurn[] = [];
  enqueue(turn: QueuedTurn): void {
    this.queue.push(turn);
    this.queue.sort((a, b) => b.priority - a.priority);
  }
  next(): QueuedTurn | undefined { return this.queue.shift(); }
}
