import { toNumber } from '@/global';
import { LSset, VIDEO_SPEED_KEY } from '@/storage';
import { getElement, setElement } from '../lib/elems';
import { waitForElement } from '../lib/funcs';

/** Handles when user uses the playback selector from Udemy */
export function handlePlaybackPopupClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target) return;

  const videoSpeed = toNumber(target.innerText);

  if (!videoSpeed) return;

  const videoElem = getElement('videoElem');
  const playbackTextElem = getElement('playbackTextElem');

  if (videoElem && playbackTextElem) {
    videoElem.playbackRate = videoSpeed;
    playbackTextElem.textContent = `${videoSpeed}x`;
    LSset(VIDEO_SPEED_KEY, videoSpeed);
  }
}

/** Adds event listener for popup to change playback rate natively */
export async function listenPlaybackPopup() {
  let playbackPopupElem = await waitForElement('playbackPopupElem');

  if (!playbackPopupElem) return;

  setElement('playbackPopupElem', playbackPopupElem);
  playbackPopupElem.addEventListener('click', handlePlaybackPopupClick);
}
