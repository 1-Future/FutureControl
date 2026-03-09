export type GridCommand =
  | { type: 'show_grid' }
  | { type: 'hide_grid' }
  | { type: 'select_cell'; cellNumber: number }
  | { type: 'select_subcell'; letter: string }
  | { type: 'direct_tap'; cellNumber: number; letter: string }
  | { type: 'back' };

export function parseGridCommand(text: string): GridCommand | null {
  const lower = text.toLowerCase().trim();

  if (/^(?:grid on|show grid|grid show|enable grid|grid)$/.test(lower)) {
    return { type: 'show_grid' };
  }

  if (/^(?:grid off|hide grid|grid hide|disable grid)$/.test(lower)) {
    return { type: 'hide_grid' };
  }

  if (/^(?:back|go back|cancel|reset)$/.test(lower)) {
    return { type: 'back' };
  }

  const directMatch = lower.match(/^(?:tap|click|press)?\s*(\d+)([a-z])$/);
  if (directMatch) {
    return {
      type: 'direct_tap',
      cellNumber: parseInt(directMatch[1], 10),
      letter: directMatch[2],
    };
  }

  const numMatch = lower.match(/^(?:tap|click|press)?\s*(\d+)$/);
  if (numMatch) {
    return { type: 'select_cell', cellNumber: parseInt(numMatch[1], 10) };
  }

  const letterMatch = lower.match(/^(?:tap|click|press)?\s*([a-z])$/);
  if (letterMatch) {
    return { type: 'select_subcell', letter: letterMatch[1] };
  }

  return null;
}
