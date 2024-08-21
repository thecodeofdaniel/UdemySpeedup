// What's this?: This gives the user shortcuts to quickly change the playback
//               speed. Incrementing or decrementing by 0.25 speed.

document.addEventListener('keydown', (event) => {
  // Only allow [ and ] to be allowed through
  if (event.key !== '[' && event.key !== ']') {
    return;
  }

  // Only allow if video and others have rendered
  if (!videoElem || !playBackTextElem) {
    return;
  }

  // Get video speed from local storage otherwise use the current one on Udemy
  let videoSpeed = toNumber(playBackTextElem.textContent);

  // If null then return
  if (!videoSpeed) return;

  // Increment speed by 0.25
  if (event.key === '[') {
    videoSpeed = roundUp(videoSpeed - 0.25);

    if (videoSpeed < MIN_SPEED) videoSpeed = MIN_SPEED;
  }

  // Decrement speed by 0.25
  if (event.key === ']') {
    videoSpeed = roundUp(videoSpeed + 0.25);

    if (videoSpeed > MAX_SPEED) videoSpeed = MAX_SPEED;
  }

  // Reflect new speed
  videoElem.playbackRate = videoSpeed;
  playBackTextElem.textContent = `${videoSpeed}x`;
  LSset(VIDEO_SPEED_KEY, videoSpeed);
});
