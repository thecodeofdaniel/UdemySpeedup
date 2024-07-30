// What's this do?: This listens to messages from the popup. A message is sent
//                  when the user opens the extension. And when the user makes
//                  any changes within the extension

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let response = {};
  // console.log('Message from popup: ', message);

  const LSvideoSpeed = LSget(VIDEO_SPEED_KEY);
  const isNewVideoSpeed = message.newSpeedValue;

  // If video speed is already set on client side
  if (LSvideoSpeed !== null && !isNewVideoSpeed) {
    response.speed = LSvideoSpeed;
  }
  // If video speed is NOT SET on client side or new value is set
  else if (LSvideoSpeed === null || isNewVideoSpeed) {
    const newVideoSpeed = message.videoSpeed;

    if (videoElem && playBackTextElem) {
      videoElem.playbackRate = +newVideoSpeed;
      playBackTextElem.textContent = `${newVideoSpeed}x`;
    }

    LSset(VIDEO_SPEED_KEY, newVideoSpeed);
    response.speed = null;
  }

  const LScheckboxValue = LSget(SKIP_DELAY_KEY);
  const isNewCheckboxValue = message.newCheckboxValue;

  // If checkbox is already set on client side
  if (LScheckboxValue !== null && !isNewCheckboxValue) {
    response.checkboxValue = LScheckboxValue;
  }
  // If checkbox is NOT SET on client side or new value is set
  else if (LScheckboxValue === null || isNewCheckboxValue) {
    const newCheckboxValue = message.checkboxValue;
    LSset(SKIP_DELAY_KEY, newCheckboxValue);
    response.checkboxValue = null;
  }

  sendResponse(response);
});
