import type { TarotCard, CardOrientation, DrawnCard, SpreadDefinition } from '@tarot/shared';
import { TAROT_CARDS } from '@tarot/shared';

export function shuffleDeck(): TarotCard[] {
  const deck = [...TAROT_CARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function drawCards(spread: SpreadDefinition): DrawnCard[] {
  const deck = shuffleDeck();
  const drawn: DrawnCard[] = [];

  for (let i = 0; i < spread.cardCount; i++) {
    const card = deck[i];
    const orientation: CardOrientation = Math.random() > 0.5 ? 'upright' : 'reversed';
    drawn.push({
      card,
      orientation,
      position: spread.positions[i],
    });
  }

  return drawn;
}
