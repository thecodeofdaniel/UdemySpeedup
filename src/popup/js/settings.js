document.addEventListener('DOMContentLoaded', () => {
  const minSpeedInput = document.getElementById('minSpeed');
  const maxSpeedInput = document.getElementById('maxSpeed');
  const saveButton = document.getElementById('saveSettings');

  // Load current settings
  browser.storage.local.get([MIN_SPEED_KEY, MAX_SPEED_KEY]).then((result) => {
    minSpeedInput.value = result.minSpeed || 0.1;
    maxSpeedInput.value = result.maxSpeed || 16;
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const minSpeed = parseFloat(minSpeedInput.value);
    const maxSpeed = parseFloat(maxSpeedInput.value);

    if (minSpeed >= 0.1 && maxSpeed <= 16 && minSpeed < maxSpeed) {
      // browser.storage.local.set({ minSpeed, maxSpeed }).then(() => {
      //   alert('Settings saved successfully!');
      //   window.close();
      // });
      LSset(MIN_SPEED_KEY, minSpeed);
      LSset(MAX_SPEED_KEY, maxSpeed);

      alert('Settings saved successfully!');
      console.log('minSpeed:', minSpeed);
      console.log('maxSpeed:', maxSpeed);
    } else {
      alert('Invalid input. Please ensure min speed is less than max speed and both are between 0.1 and 16.');
    }
  });
});
