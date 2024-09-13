// What's this?: Sets all elements' values when opening the popup.

// Set min and max for slider input
speedRangeInputElem.min = MIN_SPEED;
speedRangeInputElem.max = MAX_SPEED;

// Set videoSpeed value to slider and text input
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

// Set skipUpNext value to checkbox
browser.storage.local.get(SKIP_DELAY_KEY, (result) => {
  const value = result[SKIP_DELAY_KEY];

  if (value !== undefined) {
    checkboxElem.checked = value;
  } else {
    LSset(SKIP_DELAY_KEY, DEFAULT_CHECKBOX_VALUE);
    checkboxElem.checked = DEFAULT_CHECKBOX_VALUE;
  }
});

// Set skip intro value
browser.storage.local.get(SKIP_INTRO_KEY, (result) => {
  initSkipValue(result, skipIntroElem, SKIP_INTRO_KEY);
});

// Set skip outro value
browser.storage.local.get(SKIP_OUTRO_KEY, (result) => {
  initSkipValue(result, skipOutroElem, SKIP_OUTRO_KEY);
});
