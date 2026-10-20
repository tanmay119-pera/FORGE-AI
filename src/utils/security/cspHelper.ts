export function safeHref(url: string): string { return url.startsWith("https://") ? url : "#blocked"; }
