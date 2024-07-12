const SIDEBAR_SELECTOR = 'div[data-purpose=sidebar-content]';
const PLAYBACK_TEXT_SELECTOR = 'span.ud-focus-visible-target';

/** @type {Element} */
let videoElem;

/** @type {Element} */
let sidebarElem;

/** @type {Element} */
let playBackTextElem;

/**
 * Returns the element in the DOM once it has rendered
 *
 * @param {string} selector
 * @param {number} checkEveryMs - default is 1000ms
 * @returns {Promise<Element>}
 */
function waitForElement(selector, checkEveryMs = 1000) {
  return new Promise((resolve) => {
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else {
        setTimeout(checkElement, checkEveryMs); // Check again in 500ms
      }
    };
    checkElement();
  });
}
