import * as SecureStore from 'expo-secure-store';

const KEYS = {
  GRID_SETTINGS: 'fc_grid_settings',
} as const;

export interface GridSettings {
  gridRows?: number;
  gridCols?: number;
}

export async function saveGridSettings(settings: GridSettings): Promise<void> {
  await SecureStore.setItemAsync(KEYS.GRID_SETTINGS, JSON.stringify(settings));
}

export async function getGridSettings(): Promise<GridSettings | null> {
  const raw = await SecureStore.getItemAsync(KEYS.GRID_SETTINGS);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GridSettings;
  } catch {
    return null;
  }
}
