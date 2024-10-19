const VIDEO_SPEED_KEY = 'videoSpeed';
const SKIP_DELAY_KEY = 'skipUpNext';
const SKIP_INTRO_KEY = 'skipIntro';
const SKIP_OUTRO_KEY = 'skipOutro';
const MIN_SPEED_KEY = 'minSpeed';
const MAX_SPEED_KEY = 'maxSpeed';
const DEFAULT_SPEED = 1;
const DEFAULT_CHECKBOX_VALUE = true;
const DEFAULT_SKIP_INOUTRO = 0;
// const MIN_SPEED = 0.5;
// const MAX_SPEED = 4;

let MIN_SPEED = 0.5
let MAX_SPEED = 4;

async function initializeSpeedSettings() {
  const result = await browser.storage.local.get([MIN_SPEED_KEY, MAX_SPEED_KEY]);
  MIN_SPEED = result[MIN_SPEED_KEY] || MIN_SPEED;
  MAX_SPEED = result[MAX_SPEED_KEY] || MAX_SPEED;
}

// initializeSpeedSettings();

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

/**
 * Gets the course name for that lecture
 * @param {string} url
 * @returns {string}
 */
function extractCourseName(url) {
  const baseUrl = 'https://www.udemy.com/course/';

  if (url.startsWith(baseUrl)) {
    const coursePath = url.slice(baseUrl.length); // Remove the base URL
    const courseName = coursePath.split('/')[0]; // Extract the first part (course name)
    return courseName;
  } else {
    throw new Error('Invalid URL format');
  }
}
