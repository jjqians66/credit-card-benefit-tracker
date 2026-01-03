import { Card, Cycle } from './types';
import cardsData from './cards.json';

/**
 * Validates and maps cycle string from JSON to Cycle enum
 */
const mapCycle = (cycleStr: string): Cycle => {
  const cycleMap: Record<string, Cycle> = {
    'Monthly': Cycle.MONTHLY,
    'Quarterly': Cycle.QUARTERLY,
    'Semi-Annual': Cycle.SEMI_ANNUAL,
    'Annual': Cycle.ANNUAL,
  };
  
  const cycle = cycleMap[cycleStr];
  if (!cycle) {
    console.warn(`Unknown cycle value: ${cycleStr}, defaulting to Annual`);
    return Cycle.ANNUAL;
  }
  return cycle;
};

/**
 * Transform JSON card data to typed Card objects
 * Maps string cycle values from JSON to Cycle enum
 */
const transformCards = (cards: typeof cardsData): Card[] => {
  return cards.map(card => ({
    ...card,
    issuer: card.issuer as Card['issuer'],
    benefits: card.benefits.map(benefit => ({
      ...benefit,
      cycle: mapCycle(benefit.cycle),
    })),
  }));
};

/**
 * Seed cards loaded from cards.json configuration file
 * To update cards, edit cards.json instead of this file
 */
export const SEED_CARDS: Card[] = transformCards(cardsData);