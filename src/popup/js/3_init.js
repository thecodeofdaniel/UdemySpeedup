// What's this?: This sets the min and max for the slider input. As well as get
//               the values from local storage. If not found, then it will use
//               the default values.

// Set min and max for slider input
speedRangeInputElem.min = MIN_SPEED;
speedRangeInputElem.max = MAX_SPEED;

// Set videoSpeed value to slider and text input
browser.storage.local.get(VIDEO_SPEED_KEY, (result) => {
  const value = result[VIDEO_SPEED_KEY];
  speedRangeInputElem.value = value;
  speedTextInputElem.value = `${value}x`;
});

// Set skipUpNext value to checkbox
browser.storage.local.get(SKIP_DELAY_KEY, (result) => {
  const value = result[SKIP_DELAY_KEY];

  if (value) {
    checkboxElem.checked = value;
  } else {
    LSset(SKIP_DELAY_KEY, DEFAULT_CHECKBOX_VALUE);
    checkboxElem.checked = DEFAULT_CHECKBOX_VALUE;
  }
});
