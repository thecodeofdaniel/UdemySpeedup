// What's this?: Elements used for content scripts

export interface ElementMap {
  videoElem: HTMLVideoElement | null;
  playbackTextElem: HTMLElement | null;
  progressBarElem: HTMLElement | null;
  nextButtonElem: HTMLElement | null;
  playbackPopupElem: HTMLElement | null;
}

const SELECTORS = {
  videoElem: "video[class*='video-player--video-player']",
  playbackTextElem: "span[class*='playback-rate--trigger-text']",
  progressBarElem: '.progress-bar--slider--z064U',
  nextButtonElem: '#go-to-next-item',
  playbackPopupElem: '.playback-rate--menu--4b1Qm',
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
