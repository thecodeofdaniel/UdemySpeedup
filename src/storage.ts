// What's this?: Stuff relating to local storage for this extension

// Define the mapping of keys to their value types
export interface StorageKeyMap {
  [VIDEO_SPEED_KEY]: number;
  [SKIP_DELAY_KEY]: boolean;
  [SKIP_INTRO_KEY]: { [courseName: string]: number };
  [SKIP_OUTRO_KEY]: { [courseName: string]: number };
  [MIN_SPEED_KEY]: number;
  [MAX_SPEED_KEY]: number;
  [SLIDER_STEP_KEY]: number;
  [SHORTCUT_STEP_KEY]: number;
}

// Keys to get values
export const VIDEO_SPEED_KEY = 'videoSpeed';
export const SKIP_DELAY_KEY = 'skipUpNext';
export const SKIP_INTRO_KEY = 'skipIntro';
export const SKIP_OUTRO_KEY = 'skipOutro';
export const MIN_SPEED_KEY = 'minSpeed';
export const MAX_SPEED_KEY = 'maxSpeed';
export const SLIDER_STEP_KEY = 'sliderStep';
export const SHORTCUT_STEP_KEY = 'shortcutStep';

// Default values
export const DEFAULT_SPEED = 1;
export const DEFAULT_CHECKBOX_VALUE = true;
export const DEFAULT_SKIP_INOUTRO = 0;
export const DEFAULT_MIN_SPEED = 0.5;
export const DEFAULT_MAX_SPEED = 4;
export const DEFAULT_STEP = 0.25;

/** Returns value from key */
export function LSget<K extends keyof StorageKeyMap>(
  key: K,
): Promise<StorageKeyMap[K] | undefined> {
  return new Promise((resolve) => {
    browser.storage.local.get([key]).then((result) => {
      resolve(result[key]);
    });
  });
}

/** Sets a key value in local storage */
export function LSset<K extends keyof StorageKeyMap>(
  key: K,
  value: StorageKeyMap[K],
) {
  const data: { [key: string]: any } = {};
  data[key] = value;
  browser.storage.local.set(data);
}
