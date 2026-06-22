import { addDays, endOfMonth, format, getDay, startOfMonth } from "date-fns";

export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function getMonthGrid(month: Date): Date[] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const gridStart = addDays(start, -getDay(start));
  const gridEnd = addDays(end, 6 - getDay(end));
  const days: Date[] = [];

  for (let cursor = gridStart; cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    days.push(cursor);
  }

  return days;
}
