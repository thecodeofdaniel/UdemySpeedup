// What's this?: Common functions for content scripts

import { UDEMY_VIDEO_URL_PATTERN } from '@/global';
import { DEFAULT_SPEED, VIDEO_SPEED_KEY, LSget, LSset } from '@/storage';
import { ElementMap, getSelector } from './elems';
import { getGlobalCurrentLectureId } from './vars';

/** Returns the lecture id on the current URL */
export function getLectureId(url: string): number | null {
  const pattern =
    /^https:\/\/www\.udemy\.com\/course\/[^\/]+\/learn\/lecture\/(\d+)/;
  const match = url.match(pattern);

  if (match) {
    const lectureId = Number(match[1]);
    return lectureId;
  }

  return null;
}

/** Checks if current URL is on video lecture */
export function isOnVideoURL(): boolean {
  return UDEMY_VIDEO_URL_PATTERN.test(window.location.href);
}

/** Gets the videoSpeed in local storage otherwise the default is used */
export async function getVideoSpeed(): Promise<number> {
  const videoSpeed = await LSget(VIDEO_SPEED_KEY);

  if (videoSpeed) return videoSpeed;

  LSset(VIDEO_SPEED_KEY, DEFAULT_SPEED);
  return DEFAULT_SPEED;
}

/** Returns the element in the DOM once it has rendered */
export function waitForElement<T extends HTMLElement>(
  elemName: keyof ElementMap,
): Promise<T | null> {
  const initLectureId = getGlobalCurrentLectureId();
  const selector = getSelector(elemName);

  return new Promise((resolve) => {
    let observer: MutationObserver | null = null;

    const finish = (element: T | null) => {
      observer?.disconnect();
      resolve(element);
    };

    // Returns true once settled (found or lecture changed underneath us)
    const checkElement = (): boolean => {
      if (initLectureId !== getGlobalCurrentLectureId()) {
        finish(null);
        return true;
      }

      const element = document.querySelector(selector) as T | null;

      if (element) {
        finish(element);
        return true;
      }

      return false;
    };

    if (checkElement()) return;

    // React to the element being inserted instead of polling on a timer,
    // since Udemy swaps DOM nodes several times during a lecture transition
    // and a fixed-interval poll can miss/outrun the real node.
    observer = new MutationObserver(() => {
      checkElement();
    });
    observer.observe(document.body, { subtree: true, childList: true });
  });
}
