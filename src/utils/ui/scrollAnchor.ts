export function shouldAutoScroll(scrollHeight: number, scrollTop: number, clientHeight: number, thresholdPx = 80): boolean {
  return scrollHeight - (scrollTop + clientHeight) <= thresholdPx;
}
