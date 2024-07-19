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
