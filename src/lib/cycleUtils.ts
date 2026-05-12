import { addDays, differenceInDays, parseISO, startOfDay, format, isAfter } from 'date-fns';
import { CYCLE_PHASES, PhaseInsight } from '../constants/insights';

export function calculateNextCycle(lastStartDate: string, cycleLength: number) {
  const lastDate = parseISO(lastStartDate);
  const nextDate = addDays(lastDate, cycleLength);
  const today = startOfDay(new Date());
  
  const daysRemaining = differenceInDays(nextDate, today);
  
  return {
    nextDate,
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    isOverdue: daysRemaining < 0
  };
}

export function getStatusMessage(daysRemaining: number, isOverdue: boolean) {
  if (isOverdue) return "Your cycle is likely starting soon";
  if (daysRemaining === 0) return "Expected today";
  if (daysRemaining === 1) return "Expected tomorrow";
  return `${daysRemaining} days until next cycle`;
}

export function formatReadableDate(date: Date) {
  return format(date, 'MMM do, yyyy');
}

export function getCycleDay(lastStartDate: string) {
  const lastDate = parseISO(lastStartDate);
  const today = startOfDay(new Date());
  return differenceInDays(today, lastDate) + 1; // Day 1 is the start date
}

export function getCurrentPhase(lastStartDate: string, cycleLength: number): PhaseInsight | null {
  const day = getCycleDay(lastStartDate);
  
  // Normalize day within cycle length
  const normalizedDay = ((day - 1) % cycleLength) + 1;
  
  // Find phase that contains the normalized day
  // Since ranges are fixed in constants, we adjust for cycle length 
  // But for now, we'll just find the first phase that fits
  const phase = CYCLE_PHASES.find(p => normalizedDay >= p.range[0] && normalizedDay <= p.range[1]);
  
  // Fallback to the last phase if it's beyond the specific ranges (e.g. late luteal)
  return phase || CYCLE_PHASES[CYCLE_PHASES.length - 1];
}
