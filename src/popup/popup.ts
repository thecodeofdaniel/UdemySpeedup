// What's this?: Sets all elements' values when opening up popup

import {
  DEFAULT_CHECKBOX_VALUE,
  DEFAULT_MAX_SPEED,
  DEFAULT_MIN_SPEED,
  DEFAULT_SPEED,
  DEFAULT_STEP,
  MAX_SPEED_KEY,
  MIN_SPEED_KEY,
  SKIP_DELAY_KEY,
  SKIP_INTRO_KEY,
  SKIP_OUTRO_KEY,
  SLIDER_STEP_KEY,
  VIDEO_SPEED_KEY,
  LSget,
  LSset,
} from '@/storage';
import { initCourseName } from './0_course_name';
import { initSkipValue } from './1_functions';
import { getElement } from './2_elems';
import { initListeners } from './3_listeners';

export async function initValues() {
  const speedRangeInputElem = getElement('speedRangeInputElem');
  const speedTextInputElem = getElement('speedTextInputElem');
  const checkboxElem = getElement('checkboxElem');
  const skipIntroElem = getElement('skipIntroElem');
  const skipOutroElem = getElement('skipOutroElem');

  // Get min and max speed from local storage
  let minSpeed = await LSget(MIN_SPEED_KEY);
  let maxSpeed = await LSget(MAX_SPEED_KEY);
  let sliderStep = await LSget(SLIDER_STEP_KEY);

  // If not in local storage, set default values
  if (minSpeed === undefined) {
    LSset(MIN_SPEED_KEY, DEFAULT_MIN_SPEED);
    minSpeed = DEFAULT_MIN_SPEED;
  }

  if (maxSpeed === undefined) {
    LSset(MAX_SPEED_KEY, DEFAULT_MAX_SPEED);
    maxSpeed = DEFAULT_MAX_SPEED;
  }

  if (sliderStep === undefined) {
    LSset(SLIDER_STEP_KEY, DEFAULT_STEP);
    sliderStep = DEFAULT_STEP;
  }

  // Set min,max,step for range input
  speedRangeInputElem.min = minSpeed.toString();
  speedRangeInputElem.max = maxSpeed.toString();
  speedRangeInputElem.step = sliderStep.toString();

  // Set videoSpeed value to slider and text input
  const speed = await LSget(VIDEO_SPEED_KEY);

  if (speed === undefined) {
    LSset(VIDEO_SPEED_KEY, DEFAULT_SPEED);
    speedRangeInputElem.value = DEFAULT_SPEED.toString();
    speedTextInputElem.value = `${DEFAULT_SPEED}x`;
  } else {
    speedRangeInputElem.value = speed.toString();
    speedTextInputElem.value = `${speed}x`;
  }

  // Set skipUpNext value to checkbox
  const skipUpNextVal = await LSget(SKIP_DELAY_KEY);

  if (skipUpNextVal === undefined) {
    LSset(SKIP_DELAY_KEY, DEFAULT_CHECKBOX_VALUE);
    checkboxElem.checked = DEFAULT_CHECKBOX_VALUE;
  } else {
    checkboxElem.checked = skipUpNextVal;
  }

  // Set skip intro value
  const skipIntroObj = await browser.storage.local.get(SKIP_INTRO_KEY);
  initSkipValue(skipIntroObj, skipIntroElem, SKIP_INTRO_KEY);

  // Set skip outro value
  const skipOutroObj = await browser.storage.local.get(SKIP_OUTRO_KEY);
  initSkipValue(skipOutroObj, skipOutroElem, SKIP_OUTRO_KEY);
}

async function initPopup() {
  await initCourseName();
  await initListeners();
  await initValues();
}

document.addEventListener('DOMContentLoaded', () => {
  initPopup();
});
