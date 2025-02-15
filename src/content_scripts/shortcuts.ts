// What's this?: Changes playback when pressing shortcut keys

import { toNumber, roundUp } from '@/global';
import {
  LSget,
  SHORTCUT_STEP_KEY,
  DEFAULT_STEP,
  MIN_SPEED_KEY,
  DEFAULT_MIN_SPEED,
  MAX_SPEED_KEY,
  DEFAULT_MAX_SPEED,
  LSset,
  VIDEO_SPEED_KEY,
} from '@/storage';
import { getElement } from './lib/elems';

export function shortcuts() {
  document.addEventListener('keydown', async (event) => {
    // Only allow [ and ] to be allowed through
    if (event.key !== '[' && event.key !== ']') {
      return;
    }

    const videoElem = getElement('videoElem');
    const playbackTextElem = getElement('playbackTextElem');

    // Only allow if video and others have rendered
    if (!videoElem || !playbackTextElem) {
      return;
    }

    // Get video speed from local storage otherwise use the current one on Udemy
    let videoSpeed = toNumber(playbackTextElem.textContent ?? '') ?? 0;

    // If null then return
    if (!videoSpeed) return;

    // Grab shortcut step and min and max speed
    const shortCutStep = (await LSget(SHORTCUT_STEP_KEY)) || DEFAULT_STEP;
    const minSpeed = (await LSget(MIN_SPEED_KEY)) || DEFAULT_MIN_SPEED;
    const maxSpeed = (await LSget(MAX_SPEED_KEY)) || DEFAULT_MAX_SPEED;

    // Increment speed
    if (event.key === '[') {
      videoSpeed = roundUp(videoSpeed - shortCutStep);
      if (videoSpeed < minSpeed) videoSpeed = minSpeed;
    }

    // Decrement speed
    if (event.key === ']') {
      videoSpeed = roundUp(videoSpeed + shortCutStep);
      if (videoSpeed > maxSpeed) videoSpeed = maxSpeed;
    }

    // Reflect new speed
    videoElem.playbackRate = videoSpeed;
    playbackTextElem.textContent = `${videoSpeed}x`;
    LSset(VIDEO_SPEED_KEY, videoSpeed);
  });
}
