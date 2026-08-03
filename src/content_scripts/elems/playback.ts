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

  if (!courseName) return;
  if (skipIntroObj === undefined || skipIntroObj[courseName] === undefined)
    return;

  const skipTime = skipIntroObj[courseName];

  const applySkip = () => {
    if (videoElem.currentTime < skipTime) {
      videoElem.currentTime = skipTime;
    }
  };

  // Udemy restores the learner's last-watched position asynchronously
  // (sometimes before metadata loads, sometimes right as playback starts),
  // which can silently overwrite a one-shot seek here. Re-apply on both
  // events so whichever assignment happens last is ours.
  videoElem.addEventListener('loadedmetadata', applySkip, { once: true });
  videoElem.addEventListener('playing', applySkip, { once: true });
  applySkip();
}

export async function setPlayback() {
  let videoElem = await waitForElement<HTMLVideoElement>('videoElem');

  if (videoElem === null) return;

  setElement('videoElem', videoElem);
  await skipIntro();
  await applyPlayback();
  videoElem.addEventListener('play', applyPlayback);
}
