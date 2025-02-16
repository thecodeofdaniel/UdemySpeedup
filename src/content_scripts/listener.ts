// What's this?: Listens for the messages sent from popup (relating to playback)

import { VIDEO_SPEED_KEY } from '@/storage';
import { getElement } from './lib/elems';
import { getVideoSpeed } from './lib/funcs';

export function listener() {
  browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === 'UPDATE_PLAYBACK_TEXT') {
      const playbackTextElem = getElement('playbackTextElem');
      if (playbackTextElem === null) return;

      const videoSpeed = await getVideoSpeed();
      playbackTextElem.textContent = `${videoSpeed}x`;
    }

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
