// What's this do?: This listens to messages from the popup. A message is sent
//                  when the user opens the extension. And when the user makes
//                  any changes within the extension

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log(message);

  if (message[VIDEO_SPEED_KEY]) {
    const newVideoSpeed = message[VIDEO_SPEED_KEY];

    if (videoElem && playBackTextElem) {
      videoElem.playbackRate = newVideoSpeed;
      playBackTextElem.textContent = `${newVideoSpeed}x`;
    }
  }
});
