// What's this?: This sets the min and max for the slider input. As well as get
//               the values from local storage. If not found, then it will use
//               the default values.

// Set min and max for slider input
speedRangeInputElem.min = MIN_SPEED;
speedRangeInputElem.max = MAX_SPEED;

// // Clear local storage for testing purposes :)
// browser.storage.local.clear();

// get/set video speed
browser.storage.local.get(VIDEO_SPEED_KEY, (result) => {
  const value = result[VIDEO_SPEED_KEY];

  if (value !== undefined) {
    speedRangeInputElem.value = value;
    speedTextInputElem.value = `${value}x`;
  } else {
    LSset(VIDEO_SPEED_KEY, DEFAULT_SPEED);
    speedRangeInputElem.value = DEFAULT_SPEED;
    speedTextInputElem.value = `${DEFAULT_SPEED}x`;
  }
});

// get/set skipUpNext
browser.storage.local.get(SKIP_DELAY_KEY, (result) => {
  const value = result[SKIP_DELAY_KEY];

  if (value !== undefined) {
    checkboxElem.checked = value;
  } else {
    LSset(SKIP_DELAY_KEY, DEFAULT_CHECKBOX_VALUE);
    checkboxElem.checked = DEFAULT_CHECKBOX_VALUE;
  }
});
