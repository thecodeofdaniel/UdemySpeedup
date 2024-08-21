const VIDEO_SPEED_KEY = 'videoSpeed';
const SKIP_DELAY_KEY = 'skipUpNext';
const DEFAULT_SPEED = 1;
const DEFAULT_CHECKBOX_VALUE = true;
const MIN_SPEED = 0.5;
const MAX_SPEED = 4;

/** This will activate the extension if it matches the following
 * https://www.udemy.com/course/foo/learn/lecture/bar
 *
 * foo = name of the course
 *
 * bar = the rest of the url where it also includes the id of the lecture
 */
const UDEMY_VIDEO_URL_PATTERN =
  /^https:\/\/www\.udemy\.com\/course\/[^\/]+\/learn\/lecture/;

/**
 * Sets a key value in local storage.
 * @param {string} key
 * @param {any} value
 * @return {void}
 */
function LSset(key, value) {
  const data = {};
  data[key] = value;

  browser.storage.local.set(data, () => {
    // console.log('Value saved', data);
  });
}

/**
 * Removes any whitespace and removes the trailing 'x'. If there is
 * one. Then converts the string to number.
 * @param {string} str
 * @return {number|null}
 */
function toNumber(str) {
  str = str.trim().toUpperCase();

  if (str.endsWith('X')) {
    str = str.slice(0, -1);
  }

  if (str === '' || str === null || isNaN(str)) {
    return null;
  }

  return +str;
}

/**
 * Rounds up a float value to two decimal places
 * @param {number|string} value
 * @return {number}
 */
function roundUp(value) {
  return parseFloat(value.toFixed(2));
}
