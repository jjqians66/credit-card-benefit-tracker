import { Cycle } from '../types';

export const getPeriodKey = (cycle: Cycle, date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11

  switch (cycle) {
    case Cycle.MONTHLY:
      // Format: YYYY-MM (e.g., 2023-10)
      return `${year}-${String(month + 1).padStart(2, '0')}`;
    
    case Cycle.QUARTERLY:
      // Format: YYYY-Qx (e.g., 2023-Q1)
      const quarter = Math.floor(month / 3) + 1;
      return `${year}-Q${quarter}`;

    case Cycle.SEMI_ANNUAL:
      // Format: YYYY-Hx (e.g., 2023-H1)
      const half = month < 6 ? 1 : 2;
      return `${year}-H${half}`;

    case Cycle.ANNUAL:
      // Format: YYYY
      return `${year}`;
      
    default:
      return `${year}`;
  }
};

export const getPeriodLabel = (cycle: Cycle): string => {
    const now = new Date();
    const period = getPeriodKey(cycle, now);
    
    switch (cycle) {
        case Cycle.MONTHLY:
            return now.toLocaleString('default', { month: 'long', year: 'numeric' });
        case Cycle.QUARTERLY:
             return `Q${period.split('-Q')[1]} ${now.getFullYear()}`;
        case Cycle.SEMI_ANNUAL:
             return period.split('-')[1] === 'H1' ? `First Half ${now.getFullYear()}` : `Second Half ${now.getFullYear()}`;
        case Cycle.ANNUAL:
             return `${now.getFullYear()}`;
        default:
            return '';
    }
}

/**
 * Calculate the end date of the current cycle
 */
export const getCycleEndDate = (cycle: Cycle, date: Date = new Date()): Date => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    
    switch (cycle) {
        case Cycle.MONTHLY:
            // End of current month
            return new Date(year, month + 1, 0, 23, 59, 59, 999);
        
        case Cycle.QUARTERLY:
            // End of current quarter
            const quarter = Math.floor(month / 3);
            const quarterEndMonth = (quarter + 1) * 3 - 1; // Last month of quarter (0-indexed)
            return new Date(year, quarterEndMonth + 1, 0, 23, 59, 59, 999);
        
        case Cycle.SEMI_ANNUAL:
            // End of current half
            const half = month < 6 ? 0 : 1;
            const halfEndMonth = half === 0 ? 5 : 11; // May (5) or November (11)
            return new Date(year, halfEndMonth + 1, 0, 23, 59, 59, 999);
        
        case Cycle.ANNUAL:
            // End of current year
            return new Date(year, 11, 31, 23, 59, 59, 999);
        
        default:
            return new Date(year, 11, 31, 23, 59, 59, 999);
    }
}

/**
 * Calculate days remaining until the cycle resets
 * Returns 0 if the cycle has already ended (shouldn't happen in practice)
 */
export const getDaysRemaining = (cycle: Cycle, date: Date = new Date()): number => {
    const endDate = getCycleEndDate(cycle, date);
    const now = new Date();
    
    // Set both dates to midnight for accurate day calculation
    const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = endMidnight.getTime() - nowMidnight.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
}