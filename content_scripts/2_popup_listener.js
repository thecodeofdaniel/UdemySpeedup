// What's this do?: This listens to messages from the popup. A message is sent
//                  when the user opens the extension. And when the user makes
//                  any changes within the extension

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let response = {};

  let LSvideoSpeed = localStorage.getItem(VIDEO_SPEED_KEY) || null;

  // If video speed is already set on client side
  if (LSvideoSpeed && !message.newSpeedValue) {
    response.speed = LSvideoSpeed;
  }
  // If video speed is NOT SET on client side or new value is set
  else if (!LSvideoSpeed || message.newSpeedValue) {
    const newVideoSpeed = message.videoSpeed;

    if (videoElem && playBackTextElem) {
      videoElem.playbackRate = +newVideoSpeed;
      playBackTextElem.textContent = `${newVideoSpeed}x`;
    }

    localStorage.setItem(VIDEO_SPEED_KEY, newVideoSpeed);
    response.speed = null;
  }

  let checkboxValue = localStorage.getItem(SKIP_DELAY_KEY) || null;

  // If checkbox is already set on client side
  if (checkboxValue && !message.newCheckboxValue) {
    response.checkboxValue = checkboxValue;
  }
  // If checkbox is NOT SET on client side or new value is set
  else if (!checkboxValue || message.newCheckboxValue) {
    const newCheckboxValue = message.checkboxValue;
    localStorage.setItem(SKIP_DELAY_KEY, newCheckboxValue);
    response.checkboxValue = null;
  }

  sendResponse(response);
});
