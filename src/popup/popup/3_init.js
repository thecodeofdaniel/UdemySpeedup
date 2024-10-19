// What's this?: Sets all elements' values when opening the popup.

async function initializePopup() {
  // await browser.storage.local.clear();

  // Get min and max speed from local storage
  let minSpeed = await LSget(MIN_SPEED_KEY);
  let maxSpeed = await LSget(MAX_SPEED_KEY);
  let sliderStep = await LSget(SLIDER_STEP_KEY);

  // If not in local storage, set default values
  if (minSpeed === undefined) {
    LSset(MIN_SPEED_KEY, 0.5);
    minSpeed = 0.5;
  }

  if (maxSpeed === undefined) {
    LSset(MAX_SPEED_KEY, 4);
    maxSpeed = 4;
  }

  if (sliderStep === undefined) {
    LSset(SLIDER_STEP_KEY, DEFAULT_STEP);
    sliderStep = DEFAULT_STEP;
  }

  // Set min,max,step for range input
  speedRangeInputElem.min = minSpeed;
  speedRangeInputElem.max = maxSpeed;
  speedRangeInputElem.step = sliderStep;

  // Set videoSpeed value to slider and text input
  const speed = await LSget(VIDEO_SPEED_KEY);

  if (speed !== undefined) {
    speedRangeInputElem.value = speed;
    speedTextInputElem.value = `${speed}x`;
  } else {
    LSset(VIDEO_SPEED_KEY, DEFAULT_SPEED);
    speedRangeInputElem.value = DEFAULT_SPEED;
    speedTextInputElem.value = `${DEFAULT_SPEED}x`;
  }

  // Set skipUpNext value to checkbox
  const value2 = await LSget(SKIP_DELAY_KEY);

  if (value2 !== undefined) {
    checkboxElem.checked = value2;
  } else {
    LSset(SKIP_DELAY_KEY, DEFAULT_CHECKBOX_VALUE);
    checkboxElem.checked = DEFAULT_CHECKBOX_VALUE;
  }

  // Set skip intro value
  browser.storage.local.get(SKIP_INTRO_KEY, (result) => {
    initSkipValue(result, skipIntroElem, SKIP_INTRO_KEY);
  });

  // Set skip outro value
  browser.storage.local.get(SKIP_OUTRO_KEY, (result) => {
    initSkipValue(result, skipOutroElem, SKIP_OUTRO_KEY);
  });
}

initializePopup();
