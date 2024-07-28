// What's this do?: This gives the user shortcuts to quickly change the playback
//                  speed. Incrementing or decrementing by 0.25 speed.

document.addEventListener('keydown', (event) => {
  // Only allow [ and ] to be allowed through
  if (event.key !== '[' && event.key !== ']') {
    return;
  }

  // Only allow if video and others have rendered
  if (!videoElem || !playBackTextElem) {
    return;
  }

  let videoSpeed = LSget(VIDEO_SPEED_KEY);

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
    LSset(VIDEO_SPEED_KEY, videoSpeed);

    // Send message to background.js
    browser.runtime.sendMessage({
      speed: videoSpeed,
    });
  }
});
