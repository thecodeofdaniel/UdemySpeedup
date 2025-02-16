import { setElement } from '../lib/elems';
import { getVideoSpeed, waitForElement } from '../lib/funcs';

export async function changePlaybackText() {
  let playbackTextElem = await waitForElement('playbackTextElem');
  if (playbackTextElem === null) return;

  setElement('playbackTextElem', playbackTextElem);

  const videoSpeed = await getVideoSpeed();
  playbackTextElem.textContent = `${videoSpeed}x`;
}
