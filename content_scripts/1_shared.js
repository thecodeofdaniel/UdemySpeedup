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
function waitForElement(elemName = elem, selector, checkEveryMs = 1000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const timeoutMs = checkEveryMs * 10;

    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        const timeItTook = Date.now() - startTime;
        console.log(`It took ${timeItTook}ms to find ${elemName}`);
        resolve(element);
      } else if (Date.now() - startTime >= timeoutMs) {
        console.log(`${elemName} was not found`);
        resolve(null);
      } else {
        // console.log(`${elemName} is still waiting...`);
        setTimeout(checkElement, checkEveryMs);
      }
    };
    checkElement();
  });
}
