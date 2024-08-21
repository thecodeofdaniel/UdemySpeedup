// What's this do?: This grabs the elements by id and adds event listeners to
//                  them. If the value is changed in any of these elements. It
//                  is sent to popup listener in content_scripts.

const speedRangeInputElem = document.getElementById('speedRangeInput');
const speedTextInputElem = document.getElementById('speedTextInput');
const checkboxElem = document.getElementById('skipUpNextCheckbox');

// Listener for input text
speedTextInputElem.addEventListener('keypress', async (event) => {
  // Continue thru the function once the user hits "Enter"
  if (!(event.key === 'Enter')) {
    return;
  }

  // Grab the value (of type string) and remove any whitespace and trailing 'x'
  let value = toNumber(speedTextInputElem.value);
  const localVideoSpeed = await LS_videoSpeed();

  // If not a number DO NOT continue
  if (value === null) {
    speedTextInputElem.value = `${localVideoSpeed}x`;
    return;
  }

  // Round up value to two decimal places
  value = roundUp(value);

  // Check if speed is out of bounds
  if (value < MIN_SPEED) {
    value = MIN_SPEED;
  } else if (value > MAX_SPEED) {
    value = MAX_SPEED;
  }

  // If the new video speed is the same as old, then don't continue
  if (value === localVideoSpeed) {
    speedTextInputElem.value = `${localVideoSpeed}x`;
    return;
  }

  LSset(VIDEO_SPEED_KEY, value);
  speedRangeInputElem.value = value;
  speedTextInputElem.value = `${value}x`;
  sendKeyVal(VIDEO_SPEED_KEY, value);
});

// Listener for range (slider) input
speedRangeInputElem.addEventListener('input', () => {
  let value = +speedRangeInputElem.value;

  LSset(VIDEO_SPEED_KEY, value);
  speedTextInputElem.value = `${value}x`;
  sendKeyVal(VIDEO_SPEED_KEY, value);
});

// Listener for checkbox
checkboxElem.addEventListener('change', () => {
  LSset(SKIP_DELAY_KEY, checkboxElem.checked);
});
