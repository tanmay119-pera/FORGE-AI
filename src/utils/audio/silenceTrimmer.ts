export function trimLeadingTrailingSilence(
  samples: number[],
  threshold = 0.01
): number[] {
  let start = 0;
  while (start < samples.length && Math.abs(samples[start]) < threshold) {
    start++;
  }
  let end = samples.length - 1;
  while (end >= start && Math.abs(samples[end]) < threshold) {
    end--;
  }
  return start > end ? [] : samples.slice(start, end + 1);
}
