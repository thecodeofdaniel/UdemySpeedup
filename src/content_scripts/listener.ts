// What's this?: Listens for the messages sent from popup (relating to playback)

import { VIDEO_SPEED_KEY } from '@/storage';
import { getElement } from './lib/elems';

export function listener() {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log(message);

    if (message[VIDEO_SPEED_KEY]) {
      const newVideoSpeed: number = message[VIDEO_SPEED_KEY];

      const videoElem = getElement('videoElem');
      const playbackTextElem = getElement('playbackTextElem');

      if (videoElem && playbackTextElem) {
        videoElem.playbackRate = newVideoSpeed;
        playbackTextElem.textContent = `${newVideoSpeed}x`;
      }
    }
  });
}
