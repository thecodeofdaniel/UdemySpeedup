// What's this do?: It displays the video playback and sends that over to
//                  content_scripts, in this case, content.js.

const VIDEO_SPEED_KEY = 'videoSpeed';
const MIN_SPEED = 0.5;
const MAX_SPEED = 4;

const speedRangeInputElem = document.getElementById('speedRangeInput');
const speedTextInputElem = document.getElementById('speedTextInput');

speedRangeInputElem.min = MIN_SPEED;
speedRangeInputElem.max = MAX_SPEED;

// Gets videoSpeed from localStorage
function getVideoSpeed() {
  if (!localStorage.getItem(VIDEO_SPEED_KEY)) {
    localStorage.setItem(VIDEO_SPEED_KEY, '1');
  }

  return localStorage.getItem(VIDEO_SPEED_KEY);
}

// Grab previous speed and display to GUI popup
const videoSpeed = getVideoSpeed();
speedRangeInputElem.value = videoSpeed;
speedTextInputElem.value = `${videoSpeed}x`;

// Listener for input text
speedTextInputElem.addEventListener('keypress', (event) => {
  // Continue thru the function once the user hits "Enter"
  if (!(event.key === 'Enter')) {
    return;
  }

  // Grab the value (of type string)
  let value = speedTextInputElem.value.trim();

  // If the last character is an x, remove it
  if (value.endsWith('x')) {
    value = value.slice(0, -1);
  }

  // Dont continue if the value is empty or not a value
  if (!value || isNaN(value)) {
    speedTextInputElem.value = `${getVideoSpeed()}x`;
    return;
  }

  // if value is a decimal, make sure it only has two two decimal places
  if (value.includes('.')) {
    const decimalPart = value.split('.')[1];

    // Check if the decimal part has 3 or more digits (if so roundup)
    if (decimalPart.length >= 3) {
      value = parseFloat(value).toFixed(2);
    }
  }

  if (+value < MIN_SPEED) {
    speedTextInputElem.value = `${MIN_SPEED}x`;
    value = MIN_SPEED.toString();
  }

  if (+value > MAX_SPEED) {
    speedTextInputElem.value = `${MAX_SPEED}x`;
    value = MAX_SPEED.toString();
  }

  // If the new video speed is the same as old, then don't continue
  if (value === getVideoSpeed()) {
    return;
  }

  localStorage.setItem(VIDEO_SPEED_KEY, value);
  speedRangeInputElem.value = value;
  speedTextInputElem.value = `${value}x`;
  sendVideoSpeed(value);
});

// Listener for range (slider) input
speedRangeInputElem.addEventListener('input', () => {
  let value = speedRangeInputElem.value;

  localStorage.setItem(VIDEO_SPEED_KEY, value);
  speedTextInputElem.value = `${value}x`;
  sendVideoSpeed(value);
});

// Sends videoSpeed to content_script "content.js"
function sendVideoSpeed(speed) {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let activeTab = tabs[0];
    browser.tabs.sendMessage(activeTab.id, { videoSpeed: `${speed}` });
  });
}
