const SIDEBAR_SELECTOR = 'div[data-purpose=sidebar-content]';
const PLAYBACK_TEXT_SELECTOR = 'span.ud-focus-visible-target';

/** @type {Element} */
let videoElem = null;

/** @type {Element} */
let sidebarElem = null;

/** @type {Element} */
let playBackTextElem = null;

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
 * Checks if THIS script should be run
 *
 * @returns {boolean}
 */
function isOnURL() {
  return UDEMY_URL_PATTERN.test(window.location.href);
}
