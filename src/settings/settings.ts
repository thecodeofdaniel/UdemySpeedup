// What's this?: This initializes/updates values for settings.

import {
  DEFAULT_MAX_SPEED,
  DEFAULT_MIN_SPEED,
  DEFAULT_STEP,
  MAX_SPEED_KEY,
  MIN_SPEED_KEY,
  SHORTCUT_STEP_KEY,
  SLIDER_STEP_KEY,
  LSget,
  LSset,
} from '@/storage';
import { roundUp } from '@/global';

async function initializeSettings() {
  // browser.storage.local.clear();

  const minSpeedInputElem = document.getElementById(
    'minSpeed',
  )! as HTMLInputElement;
  const maxSpeedInputElem = document.getElementById(
    'maxSpeed',
  )! as HTMLInputElement;
  const sliderStepInputElem = document.getElementById(
    'sliderStep',
  )! as HTMLInputElement;
  const shortcutStepInputElem = document.getElementById(
    'shortcutStep',
  )! as HTMLInputElement;
  const saveButtonElem = document.getElementById(
    'saveSettings',
  )! as HTMLButtonElement;

  // Load current settings
  minSpeedInputElem.value = `${(await LSget(MIN_SPEED_KEY)) ?? DEFAULT_MIN_SPEED}`;
  maxSpeedInputElem.value = `${(await LSget(MAX_SPEED_KEY)) ?? DEFAULT_MAX_SPEED}`;
  sliderStepInputElem.value = `${(await LSget(SLIDER_STEP_KEY)) ?? DEFAULT_STEP}`;
  shortcutStepInputElem.value = `${(await LSget(SHORTCUT_STEP_KEY)) ?? DEFAULT_STEP}`;

  // Save settings if valid
  saveButtonElem.addEventListener('click', () => {
    let minSpeed = parseFloat(minSpeedInputElem.value); // stops until a NaN is found
    let maxSpeed = parseFloat(maxSpeedInputElem.value);
    let sliderStep = parseFloat(sliderStepInputElem.value);
    let shortcutStep = parseFloat(shortcutStepInputElem.value);

    if (!minSpeed || !maxSpeed || !sliderStep || !shortcutStep) {
      alert('Values cannot be empty/zero or must be a number');
    } else if (minSpeed < 0.0625 || maxSpeed > 16 || minSpeed > maxSpeed) {
      alert(
        'Please ensure min speed is less than max speed and both are between 0.0625 and 16.',
      );
    } else if (minSpeed >= 0.0625 && maxSpeed <= 16 && minSpeed < maxSpeed) {
      minSpeed = roundUp(minSpeed);
      maxSpeed = roundUp(maxSpeed);
      sliderStep = roundUp(sliderStep);
      shortcutStep = roundUp(shortcutStep);

      minSpeedInputElem.value = minSpeed.toString();
      maxSpeedInputElem.value = maxSpeed.toString();
      sliderStepInputElem.value = sliderStep.toString();
      shortcutStepInputElem.value = shortcutStep.toString();

      LSset(MIN_SPEED_KEY, minSpeed);
      LSset(MAX_SPEED_KEY, maxSpeed);
      LSset(SLIDER_STEP_KEY, sliderStep);
      LSset(SHORTCUT_STEP_KEY, shortcutStep);
      alert('Settings saved successfully!');
    }
  });
}

initializeSettings();
