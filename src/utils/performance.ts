import type { PerformanceStatus } from '../types/dashboard';

/**
 * Calculates achievement percentage given target and actual values.
 * Supports inverse indicators (where lower values represent better performance, e.g. Pupil-Teacher Ratio or Dropout Rate).
 */
export function calculateAchievement(target: number, actual: number | null, isInverse = false): number | null {
  if (actual === null || actual === undefined || isNaN(actual) || target === 0) {
    return null;
  }

  if (isInverse) {
    if (actual === 0) return 100;
    const ratio = target / actual;
    return Math.round(ratio * 1000) / 10;
  } else {
    const ratio = actual / target;
    return Math.round(ratio * 1000) / 10;
  }
}

/**
 * Derives performance status badge based on configurable thresholds:
 * Green: >= 90%
 * Yellow: 70% - 89.9%
 * Red: < 70%
 * No Data: null
 */
export function calculatePerformanceStatus(achievement: number | null): PerformanceStatus {
  if (achievement === null || achievement === undefined) {
    return 'NODATA';
  }
  if (achievement >= 90) {
    return 'GREEN';
  }
  if (achievement >= 70) {
    return 'YELLOW';
  }
  return 'RED';
}

export function calculateVariance(target: number, actual: number | null, _isInverse = false): { value: number; formatted: string } | null {
  if (actual === null || actual === undefined) return null;
  
  const diff = actual - target;
  const percentageDiff = Math.round((diff / target) * 1000) / 10;
  const sign = diff > 0 ? '+' : '';

  return {
    value: diff,
    formatted: `${sign}${diff} (${sign}${percentageDiff}%)`
  };
}

export function getStatusText(status: PerformanceStatus): string {
  switch (status) {
    case 'GREEN':
      return 'On Target / Over Performance';
    case 'YELLOW':
      return 'At Risk';
    case 'RED':
      return 'Underperforming';
    case 'NODATA':
      return 'No Updated Data';
  }
}

export function getStatusBadgeClasses(status: PerformanceStatus): string {
  switch (status) {
    case 'GREEN':
      return 'status-badge-green';
    case 'YELLOW':
      return 'status-badge-yellow';
    case 'RED':
      return 'status-badge-red';
    case 'NODATA':
      return 'status-badge-nodata';
  }
}

export function formatCurrencyUSD(amountUSD: number): string {
  if (amountUSD >= 1000000) {
    return `$${(amountUSD / 1000000).toFixed(1)}M`;
  }
  if (amountUSD >= 1000) {
    return `$${(amountUSD / 1000).toFixed(0)}K`;
  }
  return `$${amountUSD}`;
}

export function formatCurrencyTZS(amountMillions: number): string {
  if (amountMillions >= 1000) {
    return `${(amountMillions / 1000).toFixed(2)} Billion TZS`;
  }
  return `${amountMillions.toLocaleString()} Million TZS`;
}
