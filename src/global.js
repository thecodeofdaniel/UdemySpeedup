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

function LSset(key, value) {
  const jsonVal = JSON.stringify(value);
  // console.log(jsonVal);
  localStorage.setItem(key, jsonVal);
}

function LSget(key) {
  const jsonVal = JSON.parse(localStorage.getItem(key));
  // console.log(jsonVal);
  return jsonVal;
}
