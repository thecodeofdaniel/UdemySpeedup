// What's this?: Watches the URL for any changes and applys playback to new vid

import { getElement, setElement } from './lib/elems';
import { setGlobalVar } from './lib/vars';
import { getLectureId, isOnVideoURL } from './lib/funcs';
import { changePlaybackText } from './elems/playbackText';
import { applyPlayback, setPlayback } from './elems/playback';
import {
  handlePlaybackPopupClick,
  listenPlaybackPopup,
} from './elems/playbackPopup';
import { findNextVidBtn } from './elems/nextButton';
import { watchProgressBar } from './elems/progressBar';

/** Watches for URL changes. If URL is on a new lecture then apply playback to
 * new video */
export function watchURLChanges() {
  let currentLectureId = getLectureId(location.href);

  const observer = new MutationObserver((mutations) => {
    const newLectureId = getLectureId(location.href);
    if (newLectureId !== currentLectureId) {
      currentLectureId = newLectureId;
      setGlobalVar('currentLectureId', newLectureId);
      applyPlaybackToNewVid(true);
    }
  });

  const config = { subtree: true, childList: true };
  observer.observe(document, config);
}

/** Applys all necessary functions in order to apply manipulate the DOM */
export async function applyPlaybackToNewVid(isNewVideo: boolean) {
  if (isNewVideo) {
    const videoElem = getElement('videoElem');
    const playbackPopup = getElement('playbackPopupElem');

    if (videoElem && playbackPopup) {
      videoElem.removeEventListener('play', applyPlayback);
      playbackPopup.removeEventListener('click', handlePlaybackPopupClick);
    }

    setElement('videoElem', null);
    setElement('playbackTextElem', null);
    setElement('nextButtonElem', null);
    setElement('progressBarElem', null);
    setElement('playbackPopupElem', null);
  }

  if (isOnVideoURL()) {
    setPlayback();
    changePlaybackText();
    findNextVidBtn();
    watchProgressBar();
    listenPlaybackPopup();
  }
}
