import { describe, expect, it } from 'vitest';
import {
  clickAction,
  createInitialState,
  purchaseUpgrade,
  tick,
  type GameState,
} from '@clicker-game/engine';
import mageApprentice from '../game/index.js';

const study = (state: GameState, times: number): GameState => {
  for (let i = 0; i < times; i++) {
    const r = clickAction(state, 'studyManuscript', mageApprentice);
    expect(r.ok).toBe(true);
    if (r.ok) state = r.state;
  }
  return state;
};

const cast = (state: GameState, action: string, times: number): GameState => {
  for (let i = 0; i < times; i++) {
    const r = clickAction(state, action, mageApprentice);
    expect(r.ok, `clicking ${action} should succeed (iter ${i})`).toBe(true);
    if (r.ok) state = r.state;
  }
  return state;
};

describe('mage-apprentice e2e (engine only)', () => {
  it('walks the apprentice from intro to archmage', () => {
    let state = createInitialState(mageApprentice);

    state = tick(state, 100, mageApprentice);
    expect(state.story.seen).toContain('intro');

    state = study(state, 5);
    expect(state.resources.mana?.toNumber()).toBe(5);
    state = tick(state, 100, mageApprentice);
    expect(state.story.seen).toContain('firstReading');

    const buyCantrips = purchaseUpgrade(state, 'cantripsTome', mageApprentice);
    expect(buyCantrips.ok).toBe(true);
    if (buyCantrips.ok) state = buyCantrips.state;
    expect(state.upgrades.cantripsTome).toBe(1);
    expect(state.resources.mana?.toNumber()).toBe(0);

    state = study(state, 2);
    expect(state.resources.mana?.toNumber()).toBe(4);

    state = study(state, 8);
    expect(state.resources.mana?.toNumber()).toBe(20);

    state = cast(state, 'castCantrip', 5);
    expect(state.resources.arcaneKnowledge?.toNumber()).toBe(5);
    expect(state.resources.mana?.toNumber()).toBe(5);

    state = tick(state, 100, mageApprentice);
    expect(state.story.seen).toContain('cantripCast');
    expect(state.quests.firstSpell).toBe('completed');
    expect(state.flags.firstSpellCast).toBe(true);
    expect(state.quests.cantripMastery).toBe('completed');
    expect(state.story.seen).toContain('elementsAwaken');

    const buyFlames = purchaseUpgrade(state, 'tomeOfFlames', mageApprentice);
    expect(buyFlames.ok).toBe(false);

    state = study(state, 6);
    state = cast(state, 'castCantrip', 3);

    const buyFlames2 = purchaseUpgrade(state, 'tomeOfFlames', mageApprentice);
    expect(buyFlames2.ok).toBe(true);
    if (buyFlames2.ok) state = buyFlames2.state;
    expect(state.upgrades.tomeOfFlames).toBe(1);

    state = study(state, 18);
    state = cast(state, 'castCantrip', 4);
    expect(state.resources.arcaneKnowledge?.toNumber()).toBeGreaterThanOrEqual(8);

    const buyTides = purchaseUpgrade(state, 'tomeOfTides', mageApprentice);
    expect(buyTides.ok).toBe(true);
    if (buyTides.ok) state = buyTides.state;

    state = study(state, 10);
    state = cast(state, 'castCantrip', 4);
    state = cast(state, 'summonFlame', 3);
    expect(state.resources.embers?.toNumber()).toBeGreaterThanOrEqual(3);
    state = tick(state, 100, mageApprentice);
    expect(state.story.seen).toContain('flamesIgnite');

    state = study(state, 10);
    state = cast(state, 'castCantrip', 4);
    state = cast(state, 'conjureFrost', 3);
    expect(state.resources.frostShards?.toNumber()).toBeGreaterThanOrEqual(3);
    state = tick(state, 100, mageApprentice);
    expect(state.story.seen).toContain('wavesEcho');

    state = tick(state, 100, mageApprentice);
    expect(state.quests.elementalAttunement).toBe('completed');
    expect(state.flags.elementalist).toBe(true);
    expect(state.story.seen).toContain('ancientWhispers');

    state = study(state, 30);
    state = cast(state, 'castCantrip', 8);
    state = cast(state, 'summonFlame', 4);
    state = cast(state, 'conjureFrost', 4);
    expect(state.resources.embers?.toNumber()).toBeGreaterThanOrEqual(6);
    expect(state.resources.frostShards?.toNumber()).toBeGreaterThanOrEqual(6);

    const buyGrimoire = purchaseUpgrade(state, 'grimoireOfRunes', mageApprentice);
    expect(buyGrimoire.ok).toBe(true);
    if (buyGrimoire.ok) state = buyGrimoire.state;

    state = study(state, 20);
    state = cast(state, 'castCantrip', 12);
    state = cast(state, 'summonFlame', 5);
    state = cast(state, 'conjureFrost', 5);
    state = cast(state, 'inscribeRune', 5);
    expect(state.resources.runicEssence?.toNumber()).toBeGreaterThanOrEqual(5);
    state = tick(state, 100, mageApprentice);
    expect(state.story.seen).toContain('mastersGhost');

    state = tick(state, 100, mageApprentice);
    expect(state.quests.runicAdept).toBe('completed');
    expect(state.story.seen).toContain('pathOfTheArchmage');

    state = study(state, 30);
    state = cast(state, 'castCantrip', 10);
    state = cast(state, 'summonFlame', 6);
    state = cast(state, 'conjureFrost', 6);
    state = cast(state, 'inscribeRune', 6);
    expect(state.resources.runicEssence?.toNumber()).toBeGreaterThanOrEqual(10);

    const buyCodex = purchaseUpgrade(state, 'archmageCodex', mageApprentice);
    expect(buyCodex.ok).toBe(true);
    if (buyCodex.ok) state = buyCodex.state;

    state = study(state, 20);
    state = cast(state, 'castCantrip', 4);
    state = cast(state, 'summonFlame', 2);
    state = cast(state, 'conjureFrost', 2);
    state = cast(state, 'inscribeRune', 2);
    state = study(state, 6);
    state = cast(state, 'castCantrip', 3);
    state = cast(state, 'transcribeKnowledge', 1);
    expect(state.resources.wisdom?.toNumber()).toBeGreaterThanOrEqual(1);

    state = tick(state, 100, mageApprentice);
    expect(state.quests.archmageAscension).toBe('completed');
    expect(state.flags.archmage).toBe(true);
    expect(state.story.seen).toContain('newDawn');
  });
});
