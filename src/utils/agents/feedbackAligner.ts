export class FeedbackAligner {
  private positive = 0;
  private negative = 0;
  record(vote: "up" | "down"): void { if (vote === "up") this.positive++; else this.negative++; }
  approvalRatio(): number {
    const tot = this.positive + this.negative;
    return tot === 0 ? 1 : Number((this.positive / tot).toFixed(4));
  }
}
