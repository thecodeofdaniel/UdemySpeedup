// What's this?: These functions listen or watch for any changes inside their
//               elements.

/**
 * Adds event listener for popup to change playback rate natively
 */
async function listenPlaybackPopup() {
  playbackPopupElem = await waitForElement(
    'playbackPopup',
    PLAYBACK_POPUP_SELECTOR,
  );

  playbackPopupElem.addEventListener('click', (event) => {
    const videoSpeed = toNumber(event.target.innerText);

    videoElem.playbackRate = videoSpeed;
    playBackTextElem.textContent = `${videoSpeed}x`;
    LSset(VIDEO_SPEED_KEY, videoSpeed);
  });
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
  nextButtonElem = await waitForElement('nextButtonElem', NEXT_BUTTON_SELECTOR);
}

/**
 * Watches the progress bar and checks if video is 100% complete. If so,
 * simulate user clicking "next video" button
 */
async function watchProgressBar() {
  progressBarElem = await waitForElement(
    'progressBarElem',
    PROGRESS_BAR_SELECTOR,
  );

  // Create a callback function to execute when mutations are observed
  const handleCompleteProgressBar = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-valuenow'
      ) {
        const currentValue = progressBarElem.getAttribute('aria-valuenow');
        if (currentValue === '100') {
          observer.disconnect();

          browser.storage.local.get(SKIP_DELAY_KEY, (result) => {
            if (result[SKIP_DELAY_KEY]) {
              nextButtonElem.click();
            }
          });
        }
      }
    }
  };

  const observer = new MutationObserver(handleCompleteProgressBar);
  observer.observe(progressBarElem, { attributes: true });
}
