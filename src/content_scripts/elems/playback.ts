import { LSget, SKIP_INTRO_KEY } from '@/storage';
import { getVideoSpeed, waitForElement } from '../lib/funcs';
import { getElement, setElement } from '../lib/elems';
import { getGlobalVar } from '../lib/vars';

/** Applys the video playback using value from local storage */
export async function applyPlayback() {
  const videoSpeed = await getVideoSpeed();
  const globalVideoElem = getElement('videoElem');

  if (globalVideoElem) {
    globalVideoElem.playbackRate = videoSpeed;
  }
}

async function skipIntro() {
  const videoElem = getElement('videoElem')!;
  const courseName = getGlobalVar('courseName');
  const skipIntroObj = await LSget(SKIP_INTRO_KEY);

  if (courseName) {
    if (
      skipIntroObj === undefined ||
      skipIntroObj[courseName] === undefined ||
      videoElem!.currentTime > skipIntroObj[courseName]
    )
      return;

    videoElem.currentTime = skipIntroObj[courseName];
  }
}

export async function setPlayback() {
  let videoElem = await waitForElement<HTMLVideoElement>('videoElem');

  if (videoElem === null) return;

  setElement('videoElem', videoElem);
  await skipIntro();
  await applyPlayback();
  videoElem.addEventListener('play', applyPlayback);
}
