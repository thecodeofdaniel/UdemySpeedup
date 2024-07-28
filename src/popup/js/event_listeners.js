// What's this do?: This grabs the elements by id and adds event listeners to
//                  them. If the value is changed in any of these elements. It
//                  is sent to popup listener in content_scripts.

const speedRangeInputElem = document.getElementById('speedRangeInput');
const speedTextInputElem = document.getElementById('speedTextInput');
const checkboxElem = document.getElementById('skipUpNextCheckbox');

// Listener for input text
speedTextInputElem.addEventListener('keypress', (event) => {
  // Continue thru the function once the user hits "Enter"
  if (!(event.key === 'Enter')) {
    return;
  }

  // Grab the value (of type string) and remove any whitespace
  let value = speedTextInputElem.value.trim();

  // If the last character is an x, remove it
  if (value.endsWith('x')) {
    value = value.slice(0, -1);
  }

  // Dont continue if the value is empty or not a value
  if (!value || isNaN(value)) {
    speedTextInputElem.value = `${LS_videoSpeed()}x`;
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

  // Convert string to number
  value = +value;

  if (value < MIN_SPEED) {
    speedTextInputElem.value = `${MIN_SPEED}x`;
    value = MIN_SPEED;
  }

  if (value > MAX_SPEED) {
    speedTextInputElem.value = `${MAX_SPEED}x`;
    value = MAX_SPEED;
  }

  // If the new video speed is the same as old, then don't continue
  if (value === LS_videoSpeed()) {
    return;
  }

  LSset(VIDEO_SPEED_KEY, value);
  speedRangeInputElem.value = value;
  speedTextInputElem.value = `${value}x`;
  sendMessage(videoSpeedObj((isSet = true)));
});

// Listener for range (slider) input
speedRangeInputElem.addEventListener('input', () => {
  let value = +speedRangeInputElem.value;

  LSset(VIDEO_SPEED_KEY, value);
  speedTextInputElem.value = `${value}x`;
  sendMessage(videoSpeedObj((isSet = true)));
});

// Listener for checkbox
checkboxElem.addEventListener('change', () => {
  LSset(SKIP_DELAY_KEY, checkboxElem.checked);
  sendMessage(checkboxValObj((isSet = true)));
});
