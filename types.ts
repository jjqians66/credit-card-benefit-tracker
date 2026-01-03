export enum Cycle {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  SEMI_ANNUAL = 'Semi-Annual',
  ANNUAL = 'Annual',
}

export interface Benefit {
  id: string;
  cardId: string;
  title: string;
  amount?: number; // e.g. 15 for $15
  cycle: Cycle;
  description: string;
  merchant?: string;
}

export interface Card {
  id: string;
  name: string;
  issuer: 'Amex' | 'Chase' | 'Citi' | 'Capital One' | 'Other';
  color: string; // Tailwind class for visual tag (fallback if image not available)
  image?: string; // Path to card image (e.g., "/images/cards/amex-plat.png")
  benefits: Benefit[];
}

export type PeriodKey = string; // Format: "YYYY-MM", "YYYY-Q1", "YYYY-H1", "YYYY"

export interface UserData {
  myCardIds: string[];
  usage: Record<string, boolean>; // Key: benefitId_periodKey, Value: isUsed
}