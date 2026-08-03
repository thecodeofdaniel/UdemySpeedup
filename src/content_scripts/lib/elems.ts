// What's this?: Elements used for content scripts

export interface ElementMap {
  videoElem: HTMLVideoElement | null;
  playbackTextElem: HTMLElement | null;
  progressBarElem: HTMLElement | null;
  nextButtonElem: HTMLElement | null;
  playbackPopupElem: HTMLElement | null;
}

const SELECTORS = {
  videoElem: "[id^='lecture-']",
  // Udemy's CSS-module build regenerates the hash suffix (e.g. `--fEnJG`)
  // on rebuilds even when nothing user-facing changes, so match on the
  // stable, human-authored class prefix instead of the exact hashed class.
  playbackTextElem: "[class*='playback-rate-module--trigger-text--']",
  progressBarElem: "[class*='progress-bar-module--slider--']",
  nextButtonElem: '#go-to-next-item',
  playbackPopupElem: "[class*='playback-rate--menu--']",
} as const;

const globalElements: Partial<ElementMap> = {
  videoElem: null,
  playbackTextElem: null,
};

/** Gets selector based on global element */
export function getSelector(name: keyof ElementMap): string {
  return SELECTORS[name];
}

/** Gets global element */
export function getElement<K extends keyof ElementMap>(
  name: K,
): ElementMap[K] | null {
  return globalElements[name] as ElementMap[K] | null;
}

/** Sets global element */
export function setElement<K extends keyof ElementMap>(
  name: K,
  element: ElementMap[K] | null,
): ElementMap[K] | null {
  globalElements[name] = element;
  return globalElements[name] as ElementMap[K] | null;
}
