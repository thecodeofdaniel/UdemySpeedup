// What's this?: These functions listen or watch for any changes inside their
//               elements.

/**
 * Adds event listener for popup to change playback rate natively
 */
async function listenPlaybackPopup() {
  playbackPopupElem = await waitForElement(
    'playbackPopup',
    PLAYBACK_POPUP_SELECTOR,
    globalCurrentLectureId,
  );

  if (!playbackPopupElem) return;

  playbackPopupElem.addEventListener('click', handlePlaybackPopupClick);
}

/**
 * Returns the lecture id on the current URL.
 * @param {string} url
 * @returns {string|null} lecture id
 */
function getLectureId(url) {
  const pattern =
    /^https:\/\/www\.udemy\.com\/course\/[^\/]+\/learn\/lecture\/(\d+)/;
  const match = url.match(pattern);

  if (match) {
    const lectureId = match[1];
    return lectureId;
  }

  return null;
}

/**
 * Watches for URL changes. If URL is on a new lecture then apply playback to
 * new video
 */
function watchURLChanges() {
  let currentLectureId = getLectureId(location.href);

  const observer = new MutationObserver((mutations) => {
    const newLectureId = getLectureId(location.href);
    if (newLectureId !== currentLectureId) {
      currentLectureId = newLectureId;
      globalCurrentLectureId = newLectureId;
      applyPlaybackToNewVid(true);
    }
  });

  const config = { subtree: true, childList: true };
  observer.observe(document, config);
}

/**
 * Finds the "next video" button element.
 */
async function findNextVidBtn() {
  nextButtonElem = await waitForElement(
    'nextButtonElem',
    NEXT_BUTTON_SELECTOR,
    globalCurrentLectureId,
  );

  if (!nextButtonElem) return;
}

/**
 * Returns value from key
 * @param {string} key
 * @returns {Promise<any>}
 */
function LSget(key) {
  return new Promise((resolve) => {
    browser.storage.local.get(key, (result) => {
      resolve(result[key]);
    });
  });
}

/**
 * Watches when the current time of video in UI changes.
 */
async function watchProgressBar() {
  progressBarElem = await waitForElement(
    'currentTimeElem',
    PROGRESS_BAR_SELECTOR,
    globalCurrentLectureId,
  );

  if (!progressBarElem) return;

  // Create a callback function to execute when mutations are observed
  const handleChange = async (mutationsList) => {
    // If elem doesn't exist or video is finished
    if (!videoElem) return;

    const skipOutroObj = await LSget(SKIP_OUTRO_KEY);
    const skipOutroSeconds = skipOutroObj?.[courseName] ?? 0;

    for (const mutation of mutationsList) {
      const progress = mutation.target.getAttribute('aria-valuenow');
      // console.log(progress);

      if (
        skipOutroSeconds <= 1 &&
        mutation.attributeName === 'aria-valuenow' &&
        progress === '100'
      ) {
        const skipDelay = await LSget(SKIP_DELAY_KEY);
        if (skipDelay) nextButtonElem.click();
      } else if (
        skipOutroSeconds > 1 &&
        mutation.attributeName === 'aria-valuetext' &&
        progress !== '100' &&
        videoElem.currentTime !== videoElem.duration
      ) {
        const newDuration = videoElem.duration - skipOutroSeconds;
        // console.log(`${videoElem.currentTime} >= ${newDuration}`);

        if (videoElem.currentTime >= newDuration) {
          const skipDelay = await LSget(SKIP_DELAY_KEY);
          if (skipDelay) {
            nextButtonElem.click();
          } else {
            // console.log('here');
            videoElem.currentTime = videoElem.duration;
            mutation.target.setAttribute('aria-valuenow', '100');
          }
        }
      }
    }
  };

  if (progressBarObserver) {
    progressBarObserver.disconnect();
    progressBarObserver = null;
  }

  progressBarObserver = new MutationObserver(handleChange);
  progressBarObserver.observe(progressBarElem, {
    attributes: true,
    attributeFilter: ['aria-valuetext', 'aria-valuenow'],
  });
}
