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
 * Watches the progress bar and checks if video is 100% complete. If so,
 * simulate user clicking "next video" button
 */
async function watchProgressBar() {
  progressBarElem = await waitForElement(
    'progressBarElem',
    PROGRESS_BAR_SELECTOR,
    globalCurrentLectureId,
  );

  if (!progressBarElem) return;

  // Disconnect previous observer if found
  if (progressBarObserver) {
    progressBarObserver.disconnect();
    progressBarObserver = null;
  }

  const handleCompleteProgressBar = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-valuenow'
      ) {
        const currentValue = progressBarElem.getAttribute('aria-valuenow');

        // Once video is done (either skip "Up Next" if user chose true)
        if (currentValue === '100') {
          browser.storage.local.get(SKIP_DELAY_KEY, (result) => {
            if (result[SKIP_DELAY_KEY]) {
              nextButtonElem.click();
            }
          });
        }
      }
    }
  };

  progressBarObserver = new MutationObserver(handleCompleteProgressBar);
  progressBarObserver.observe(progressBarElem, { attributes: true });
}

async function watchCurrentTime() {
  currentTimeElem = await waitForElement(
    'currentTimeElem',
    PROGRESS_BAR_SELECTOR,
    globalCurrentLectureId,
  );

  if (!currentTimeElem) return;

  if (currentTimeObserver) {
    currentTimeObserver.disconnect();
    currentTimeObserver = null;
  }

  // Create a callback function to execute when mutations are observed
  const handleTimeChange = (mutationsList, observer) => {
    if (!videoElem) return;

    for (const mutation of mutationsList) {
      // console.log(mutation.target.getAttribute('aria-valuenow'));

      // Get the skipOutro value for course
      browser.storage.local.get(SKIP_OUTRO_KEY, (result) => {
        let skipOutroSeconds = result[SKIP_OUTRO_KEY];

        // If skipOutro is not defined or not defined for the course, return
        if (
          skipOutroSeconds === undefined ||
          skipOutroSeconds[courseName] === undefined
        )
          return;

        // Skip outro or skip to next video when it's over if user chose so
        if (
          videoElem.currentTime >=
            videoElem.duration - skipOutroSeconds[courseName] ||
          mutation.target.getAttribute('aria-valuenow') === '100'
        ) {
          // Either skip to next video or skip to "Up Next" screen
          browser.storage.local.get(SKIP_DELAY_KEY, (result) => {
            if (result[SKIP_DELAY_KEY]) {
              nextButtonElem.click();
            } else {
              if (videoElem.currentTime !== videoElem.duration) {
                console.log('here');
                videoElem.currentTime = videoElem.duration;
              }
            }
          });
        }
      });
    }
  };

  currentTimeObserver = new MutationObserver(handleTimeChange);
  currentTimeObserver.observe(currentTimeElem, { attributes: true });
}
