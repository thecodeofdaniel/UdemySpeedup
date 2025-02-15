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
    const checkElement = () => {
      const currentLectureId = getGlobalCurrentLectureId();

      if (initLectureId !== currentLectureId) {
        // console.log(`stop finding ${elemName} with ${initLectureId}`);
        resolve(null);
        return;
      }

      const element = document.querySelector(selector) as T;

      if (element) {
        // console.log(`${elemName} is found!`);
        resolve(element);
      } else {
        // console.log(`${elemName} is still waiting...`);
        setTimeout(checkElement, 1000);
      }
    };

    checkElement();
  });
}
