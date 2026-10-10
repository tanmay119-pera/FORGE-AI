export class AudioRingBuffer {
  private buffer: number[];
  private capacity: number;

  constructor(capacity = 4096) {
    this.capacity = capacity;
    this.buffer = [];
  }

  push(samples: number[]): void {
    for (const s of samples) {
      if (this.buffer.length >= this.capacity) {
        this.buffer.shift();
      }
      this.buffer.push(s);
    }
  }

  snapshot(): number[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
  }
}
