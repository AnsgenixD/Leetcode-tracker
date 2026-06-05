// src/utils/time.ts

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Calculates current virtual time based on time offset in milliseconds.
 */
export function getVirtualTimestamp(offsetMs: number): number {
  return Date.now() + offsetMs;
}

/**
 * Returns YYYY-MM-DD string representation of a Date or timestamp in local time.
 */
export function toDateString(dateOrMs: Date | number): string {
  const d = typeof dateOrMs === 'number' ? new Date(dateOrMs) : dateOrMs;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats full UTC representation with standard spacing for displays.
 */
export function formatUTC(timestamp: number): string {
  return new Date(timestamp).toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Computes days until due. Negative numbers indicate it is overdue.
 */
export function getDaysUntilDue(nextReviewAt: number, virtualNow: number): number {
  const diffMs = nextReviewAt - virtualNow;
  return diffMs / ONE_DAY_MS;
}
