document.addEventListener('DOMContentLoaded', () => {
  const minSpeedInputElem = document.getElementById('minSpeed');
  const maxSpeedInputElem = document.getElementById('maxSpeed');
  const saveButtonElem = document.getElementById('saveSettings');

  // Load current settings to inputs
  browser.storage.local.get([MIN_SPEED_KEY, MAX_SPEED_KEY]).then((result) => {
    minSpeedInputElem.value = result[MIN_SPEED_KEY] || 0.5;
    maxSpeedInputElem.value = result[MAX_SPEED_KEY] || 4;
  });

  // Save settings if valid
  saveButtonElem.addEventListener('click', () => {
    const minSpeed = parseFloat(minSpeedInputElem.value);
    const maxSpeed = parseFloat(maxSpeedInputElem.value);

    if (
      minSpeed &&
      maxSpeed &&
      minSpeed >= 0.0625 &&
      maxSpeed <= 16 &&
      minSpeed < maxSpeed
    ) {
      LSset(MIN_SPEED_KEY, minSpeed);
      LSset(MAX_SPEED_KEY, maxSpeed);
      alert('Settings saved successfully!');
    } else {
      alert(
        'Invalid input. Please ensure min speed is less than max speed and both are between 0.0625 and 16.',
      );
    }
  });
});
