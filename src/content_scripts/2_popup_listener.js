// What's this?: This listens to messages from the popup. In this case when the
//               user changes the playback text from the popup. Updating the
//               video speed and playback text.

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
