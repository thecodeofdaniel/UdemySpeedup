document.addEventListener('DOMContentLoaded', async () => {
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
    const minSpeed = parseFloat(minSpeedInputElem.value);
    const maxSpeed = parseFloat(maxSpeedInputElem.value);
    const sliderStep = parseFloat(sliderStepInputElem.value);
    const shortcutStep = parseFloat(shortcutStepInputElem.value);

    if (!minSpeed || !maxSpeed || !sliderStep || !shortcutStep) {
      alert('Values cannot be empty/zero or must be a number');
    } else if (minSpeed < 0.0625 || maxSpeed > 16 || minSpeed > maxSpeed) {
      alert(
        'Please ensure min speed is less than max speed and both are between 0.0625 and 16.',
      );
    } else if (minSpeed >= 0.0625 && maxSpeed <= 16 && minSpeed < maxSpeed) {
      LSset(MIN_SPEED_KEY, minSpeed);
      LSset(MAX_SPEED_KEY, maxSpeed);
      LSset(SLIDER_STEP_KEY, sliderStep);
      LSset(SHORTCUT_STEP_KEY, shortcutStep);
      alert('Settings saved successfully!');
    }
  });
});
