// What's this do?: It displays the video playback and sends that over to
//                  content_scripts, in this case, content.js.

const speedRangeInputElem = document.getElementById('speedRangeInput');
const speedTextInputElem = document.getElementById('speedTextInput');
const checkboxElem = document.getElementById('skipUpNextCheckbox');

speedRangeInputElem.min = MIN_SPEED;
speedRangeInputElem.max = MAX_SPEED;

document.getElementById('start-speed').textContent = `${MIN_SPEED}x`;
document.getElementById('end-speed').textContent = `${MAX_SPEED}x`;

// Gets videoSpeed from localStorage
function getVideoSpeed() {
  let videoSpeed = localStorage.getItem(VIDEO_SPEED_KEY) || null;

  if (!videoSpeed) {
    videoSpeed = DEFAULT_SPEED.toString();
    localStorage.setItem(VIDEO_SPEED_KEY, videoSpeed);
  }

  return videoSpeed;
}

function getSkipDelayCheckboxValue() {
  let isChecked = localStorage.getItem(SKIP_DELAY_KEY) || null;

  if (!isChecked) {
    isChecked = DEFAULT_SKIP_DELAY_CB_VALUE.toString();
    localStorage.setItem(SKIP_DELAY_KEY, isChecked);
  }

  return isChecked;
}

// Grab previous speed and display to GUI popup
const videoSpeed = getVideoSpeed();
const skipDelayCBVal = getSkipDelayCheckboxValue();
speedRangeInputElem.value = videoSpeed;
speedTextInputElem.value = `${videoSpeed}x`;
checkboxElem.checked = skipDelayCBVal;

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

checkboxElem.addEventListener('change', () => {
  const isChecked = checkboxElem.checked;
  localStorage.setItem(SKIP_DELAY_KEY, isChecked);
  sendCheckbox();
});

// Sends new videoSpeed to content_scripts
function sendVideoSpeed(speed, newSpeedSet = true) {
  return browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      let activeTab = tabs[0];
      return browser.tabs.sendMessage(activeTab.id, {
        videoSpeed: `${speed}`,
        newSpeedValue: newSpeedSet,
      });
    });
}

// Sends new checked value to content_scripts
function sendCheckbox(isNew = true) {
  return browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      let activeTab = tabs[0];
      return browser.tabs.sendMessage(activeTab.id, {
        checkboxValue: localStorage.getItem(SKIP_DELAY_KEY),
        newCheckboxValue: isNew,
      });
    });
}

sendCheckbox(false)
  .then((response) => {
    console.log('Response from content script:', response);
    if (response.checkboxValue) {
      checkboxElem.checked = response.checkboxValue === 'true';
    }
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });

// Sends videoSpeed to content_scripts when user opens up extension and expects
// a response back
sendVideoSpeed(getVideoSpeed(), false)
  .then((response) => {
    // console.log('Response from content script:', response);

    if (response.speed) {
      const videoSpeed = response.speed;
      speedRangeInputElem.value = videoSpeed;
      speedTextInputElem.value = `${videoSpeed}x`;
    }
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });
