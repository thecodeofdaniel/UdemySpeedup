// What's this do?: These are the elements we'll use and common functions that
//                  used through out the content scripts

/** @type {Element} */
let videoElem = null;

/** @type {Element} */
let playBackTextElem = null;

/** @type {Element} */
let progressBarElem = null;

/** @type {Element} */
let nextButtonElem = null;

/** @type {Element} */
let playbackPopupElem = null;

/** Udemy's playback rates */
const UDEMY_PLAYBACK_RATES = {
  '0.5x': 0.5,
  '0.75x': 0.75,
  '1x': 1,
  '1.25x': 1.25,
  '1.5x': 1.5,
  '1.75x': 1.75,
  '2x': 2,
};

/**
 * Returns the element in the DOM once it has rendered
 *
 * @param {string} elemName - name of element variable (default is elem)
 * @param {string} selector
 * @param {number} checkEveryMs - default is 1000ms
 * @returns {Promise<Element>}
 */
function waitForElement(elemName = 'elem', selector, checkEveryMs = 1000) {
  return new Promise((resolve) => {
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        // console.log(`${elemName} is found!`);
        resolve(element);
      } else {
        // console.log(`${elemName} is still waiting...`);
        setTimeout(checkElement, checkEveryMs);
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
 * Applys all necessary functions in order to apply manipulate the DOM. Needs to
 * now if page is reloaded. If so, then it's on its first run.
 *
 * @param {boolean} firstRun
 */
function applyPlaybackToNewVid(firstRun) {
  if (!firstRun) {
    videoElem = null;
    playBackTextElem = null;
    progressBarElem = null;
    nextButtonElem = null;
    playbackPopupElem = null;
  }

  if (isOnVideoURL()) {
    setPlayback();
    !firstRun && changePlaybackText();
    findNextVidBtn();
    watchProgressBar();
    listenPlaybackPopup();
  }
}
