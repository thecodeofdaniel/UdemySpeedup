document.addEventListener('keydown', (event) => {
  // Only allow [ and ] to be allowed through
  if (event.key !== '[' && event.key !== ']') {
    return;
  }

  // Only allow if video and others have rendered
  if (!videoElem || !playBackTextElem) {
    return;
  }

  let videoSpeed = +localStorage.getItem(VIDEO_SPEED_KEY) || DEFAULT_SPEED;

  if (videoSpeed) {
    if (event.key === '[') {
      videoSpeed -= 0.25;
      if (videoSpeed < MIN_SPEED) {
        videoSpeed = MIN_SPEED;
      }
    }

    if (event.key === ']') {
      videoSpeed += 0.25;
      if (videoSpeed > MAX_SPEED) {
        videoSpeed = MAX_SPEED;
      }
    }

    videoElem.playbackRate = videoSpeed;
    playBackTextElem.textContent = `${videoSpeed}x`;
    localStorage.setItem(VIDEO_SPEED_KEY, videoSpeed);

    // Send message to background.js
    browser.runtime.sendMessage({
      speed: videoSpeed,
    });
  }
});
