// What's this do?: This listens to messages from the popup. A message is sent
//                  when the user opens the extension. And when the user makes
//                  any changes within the extension

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if videoSpeed from localStorage exists
  let videoSpeed = localStorage.getItem(VIDEO_SPEED_KEY) || null;
  let response = {};

  // Tell popup to use localStorage's speed for reference
  if (videoSpeed && !message.newSpeedValue) {
    response.speed = videoSpeed;
  } else {
    // Otherwise accept new videoSpeed from popup
    videoSpeed = message.videoSpeed;

    if (videoElem && playBackTextElem) {
      videoElem.playbackRate = +videoSpeed;
      playBackTextElem.textContent = `${videoSpeed}x`;
    }

    localStorage.setItem(VIDEO_SPEED_KEY, videoSpeed);
    response.speed = null;
  }

  let checkboxValue = localStorage.getItem(SKIP_DELAY_KEY) || null;

  if (checkboxValue && !message.newCheckboxValue) {
    // If localstorage value is found send that to popup
    response.checkboxValue = checkboxValue;
  } else {
    checkboxValue = message.checkboxValue;
    localStorage.setItem(SKIP_DELAY_KEY, checkboxValue);
    response.checkboxValue = null;
  }

  sendResponse(response);
});
