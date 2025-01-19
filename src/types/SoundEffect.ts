export interface Hotkey {
  modifiers: string[];
  key: string;
}

export interface SoundEffect {
  command: string;
  hotkey: Hotkey;
  description: string;
  file: string;
}

