// What's this do?: This listens to messages from the popup. A message is sent
//                  when the user opens the extension. And when the user makes
//                  any changes within the extension

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if videoSpeed from localStorage exists
  let videoSpeed = localStorage.getItem(VIDEO_SPEED_KEY) || null;

  // Tell popup to use localStorage's speed for reference
  if (videoSpeed && !message.newSpeedSet) {
    sendResponse({ speed: videoSpeed });
    return;
  }

  // Otherwise accept new videoSpeed from popup
  videoSpeed = message.videoSpeed;

  if (videoElem && playBackTextElem) {
    videoElem.playbackRate = +videoSpeed;
    playBackTextElem.textContent = `${videoSpeed}x`;
  }

  localStorage.setItem(VIDEO_SPEED_KEY, videoSpeed);
  sendResponse({ speed: null });
});
