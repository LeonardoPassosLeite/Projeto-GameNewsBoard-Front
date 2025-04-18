export enum IgdbPlatform {
  All = 0,
  PC = 6,
  PS3 = 9,
  PS4 = 48,
  PS5 = 167,
  Xbox360 = 12,
  XboxOne = 49,
  XboxSeries = 169,
  NintendoSwitch = 130,
}

export const IgdbPlatformLabelMap: Record<IgdbPlatform, string> = {
  [IgdbPlatform.All]: 'Todos',
  [IgdbPlatform.PC]: 'PC',
  [IgdbPlatform.PS3]: 'PS3',
  [IgdbPlatform.PS4]: 'PS4',
  [IgdbPlatform.PS5]: 'PS5',
  [IgdbPlatform.Xbox360]: 'Xbox 360',
  [IgdbPlatform.XboxOne]: 'Xbox One',
  [IgdbPlatform.XboxSeries]: 'Xbox Series X|S',
  [IgdbPlatform.NintendoSwitch]: 'Nintendo Switch',
};

export function getPlatformOptions(): { id: number; name: string }[] {
  return Object.entries(IgdbPlatformLabelMap).map(([id, name]) => ({
    id: +id,
    name,
  }));
}