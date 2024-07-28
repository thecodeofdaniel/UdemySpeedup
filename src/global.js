const VIDEO_SPEED_KEY = 'videoSpeed';
const SKIP_DELAY_KEY = 'skipUpNext';
const DEFAULT_SPEED = 1;
const DEFAULT_CHECKBOX_VALUE = true;
const MIN_SPEED = 0.5;
const MAX_SPEED = 4;

// This will activate the extension if it matches the following
// https://www.udemy.com/course/<foo>/learn/lecture/<bar>
// foo = name of the course
// bar = is the id of the lecture
const UDEMY_VIDEO_URL_PATTERN =
  /^https:\/\/www\.udemy\.com\/course\/[^\/]+\/learn\/lecture\/[^\/]+$/;

/**
 * Sets a key value in local storage. However it stores it as a JSON string.
 * This is to save the value type when retreiving the value.
 * @param {string} key
 * @param {any} value
 * @return {void}
 */
function LSset(key, value) {
  const jsonStr = JSON.stringify(value);
  localStorage.setItem(key, jsonStr);
}

/**
 * Retrieves a value in local storage. Using JSON.parse(). This saves the value
 * type, making it predictable.
 * @param {string} key
 * @returns {any}
 */
function LSget(key) {
  const jsonVal = JSON.parse(localStorage.getItem(key));
  return jsonVal;
}
