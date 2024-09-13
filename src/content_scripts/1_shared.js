// What's this?: These are the elements we'll use and common functions that used
//               through out the content scripts.

/** @type {string|undefined} */
let courseName;

/** @type {number|undefined} */
let globalCurrentLectureId;

/** @type {MutationObserver|undefined} */
let progressBarObserver;

/**
 * Returns the element in the DOM once it has rendered
 *
 * @param {string} elemName - name of element variable (default is elem)
 * @param {string} selector
 * @param {number} elemId   - the element for that lecture id
 * @returns {Promise<Element>}
 */
function waitForElement(elemName = 'elem', selector, elemId) {
  return new Promise((resolve) => {
    const checkElement = () => {
      if (elemId !== globalCurrentLectureId) {
        // console.log(`stop finding ${elemName} with ${elemId}`);
        resolve(null);
        return;
      }

      const element = document.querySelector(selector);
      if (element) {
        // console.log(`${elemName} is found!`);
        resolve(element);
      } else {
        // console.log(`${elemName} is still waiting...`);
        setTimeout(checkElement, 1000);
      }
    };
    checkElement();
  });
}

/**
 * Checks if current URL is on video lecture
 *
 * @returns {boolean}
 */
function isOnVideoURL() {
  return UDEMY_VIDEO_URL_PATTERN.test(window.location.href);
}

/**
 * Gets the videoSpeed in local storage otherwise the default is used.
 * @returns {Promise<number>}
 */
async function getVideoSpeed() {
  // Find the speed in local storage first
  const videoSpeed = await browser.storage.local
    .get(VIDEO_SPEED_KEY)
    .then((result) => result[VIDEO_SPEED_KEY]);

  if (videoSpeed) {
    return videoSpeed;
  }

  // Otherwise use the default speed
  LSset(VIDEO_SPEED_KEY, DEFAULT_SPEED);
  return DEFAULT_SPEED;
}

/**
 * Handles when user uses the playback selector from Udemy
 * @param {MouseEvent} event
 * @returns {void}
 */
function handlePlaybackPopupClick(event) {
  const videoSpeed = toNumber(event.target.innerText);

  if (!videoSpeed) return;

  videoElem.playbackRate = videoSpeed;
  playBackTextElem.textContent = `${videoSpeed}x`;
  LSset(VIDEO_SPEED_KEY, videoSpeed);
}

/**
 * Applys the video playback using value from local storage
 */
async function applyPlayback() {
  const videoSpeed = await getVideoSpeed();
  videoElem.playbackRate = videoSpeed;
}

/**
 * Applys all necessary functions in order to apply manipulate the DOM
 *
 * @param {boolean} isNew
 */
async function applyPlaybackToNewVid(isNew) {
  if (isNew) {
    if (videoElem && playbackPopupElem) {
      videoElem.removeEventListener('play', applyPlayback);
      playbackPopupElem.removeEventListener('play', handlePlaybackPopupClick);
    }

    videoElem = null;
    playBackTextElem = null;
    nextButtonElem = null;
    progressBarElem = null;
    playbackPopupElem = null;
  }

  if (isOnVideoURL()) {
    setPlayback();
    isNew && changePlaybackText();
    findNextVidBtn();
    watchProgressBar();
    listenPlaybackPopup();
  }
}
