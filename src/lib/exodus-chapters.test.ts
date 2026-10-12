import { describe, expect, it } from 'vitest';
import { chapters } from './exodus-chapters';
describe('Biblical chapter sequence', () => {
  it('begins with Hebrew slavery in Egypt', () => { expect(chapters[0]?.act).toBe('Bondage'); expect(chapters[0]?.reference).toBe('Exodus 1:8–14'); });
  it('includes the ten plagues in their biblical order', () => { expect(chapters.filter(c => c.act === 'The plagues').map(c => c.title)).toEqual(['Water into blood', 'The frogs', 'The lice', 'The flies', 'The livestock', 'The boils', 'The hail', 'The locusts', 'The darkness', 'The firstborn & Passover']); });
  it('ends with the departure and sea crossing', () => { expect(chapters.at(-1)?.reference).toBe('Exodus 12:33–14:31'); expect(chapters.at(-1)?.act).toBe('Deliverance'); });
});
