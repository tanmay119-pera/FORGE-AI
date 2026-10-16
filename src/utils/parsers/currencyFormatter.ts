export function formatFare(amount: number, currency = "INR"): string {
  const sym = currency === "USD" ? "$" : "Rs.";
  return `${sym} ${amount.toFixed(2)}`;
}
export function parseFareAmount(text: string): number | null {
  const m = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}
