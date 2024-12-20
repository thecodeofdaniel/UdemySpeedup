// What's this?: Adds event listeners to elements. If playback is changed then
//               it is sent to the popup listener. In this case, to content
//               script number 2.

// Listener for input text
speedTextInputElem.addEventListener('keypress', async (event) => {
  // Continue thru the function once the user hits "Enter"
  if (!(event.key === 'Enter')) {
    return;
  }

  // Grab the value (of type string) and remove any whitespace and trailing 'x'
  let value = toNumber(speedTextInputElem.value);

  // Gets the previous video speed from local storage
  const prevVideoSpeed = await browser.storage.local
    .get(VIDEO_SPEED_KEY)
    .then((result) => result[VIDEO_SPEED_KEY]);

  // If not a number DO NOT continue
  if (value === null) {
    speedTextInputElem.value = `${prevVideoSpeed}x`;
    return;
  }

  // Round up value to two decimal places
  value = roundUp(value);
  const maxSpeed = await LSget(MAX_SPEED_KEY);
  const minSpeed = await LSget(MIN_SPEED_KEY);

  // Check if speed is out of bounds
  if (value < minSpeed) {
    value = minSpeed;
  } else if (value > maxSpeed) {
    value = maxSpeed;
  }

  // If the new video speed is the same as old, then don't continue
  if (value === prevVideoSpeed) {
    speedTextInputElem.value = `${prevVideoSpeed}x`;
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

// Gets the course name from url
let courseName;
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  const activeTab = tabs[0];
  const url = activeTab.url;
  courseName = extractCourseName(url);
});

// Sets and saves skip intro value
skipIntroElem.addEventListener('keypress', (event) =>
  saveSkipValue(event, SKIP_INTRO_KEY),
);

// Sets and saves skip outro value
skipOutroElem.addEventListener('keypress', (event) =>
  saveSkipValue(event, SKIP_OUTRO_KEY),
);

// Open settings page
settingsBtnElem.addEventListener('click', (e) => {
  e.preventDefault();
  browser.runtime.openOptionsPage();
  window.close();
});
