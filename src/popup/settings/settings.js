// What's this?: This initializes all the values for the inputs for settings.

async function initializeSettings() {
  const minSpeedInputElem = document.getElementById('minSpeed');
  const maxSpeedInputElem = document.getElementById('maxSpeed');
  const sliderStepInputElem = document.getElementById('sliderStep');
  const shortcutStepInputElem = document.getElementById('shortcutStep');
  const saveButtonElem = document.getElementById('saveSettings');

  // Load current settings
  minSpeedInputElem.value = await LSget(MIN_SPEED_KEY);
  maxSpeedInputElem.value = await LSget(MAX_SPEED_KEY);
  sliderStepInputElem.value = (await LSget(SLIDER_STEP_KEY)) || DEFAULT_STEP;
  shortcutStepInputElem.value =
    (await LSget(SHORTCUT_STEP_KEY)) || DEFAULT_STEP;

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

      minSpeedInputElem.value = minSpeed;
      maxSpeedInputElem.value = maxSpeed;
      sliderStepInputElem.value = sliderStep;
      shortcutStepInputElem.value = shortcutStep;

      LSset(MIN_SPEED_KEY, minSpeed);
      LSset(MAX_SPEED_KEY, maxSpeed);
      LSset(SLIDER_STEP_KEY, sliderStep);
      LSset(SHORTCUT_STEP_KEY, shortcutStep);
      alert('Settings saved successfully!');
    }
  });
}

initializeSettings();
