// What's this?: This gives the user shortcuts to quickly change the playback
//               speed. Incrementing or decrementing by 0.25 speed.

document.addEventListener('keydown', async (event) => {
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

  // Grab shortcut step and min and max speed
  const shortCutStep = (await LSget(SHORTCUT_STEP_KEY)) || DEFAULT_STEP;
  const minSpeed = (await LSget(MIN_SPEED_KEY)) || DEFAULT_MIN_SPEED;
  const maxSpeed = (await LSget(MAX_SPEED_KEY)) || DEFAULT_MAX_SPEED;

  // Increment speed
  if (event.key === '[') {
    videoSpeed = roundUp(videoSpeed - shortCutStep);
    if (videoSpeed < minSpeed) videoSpeed = minSpeed;
  }

  // Decrement speed
  if (event.key === ']') {
    videoSpeed = roundUp(videoSpeed + shortCutStep);
    if (videoSpeed > maxSpeed) videoSpeed = maxSpeed;
  }

  // Reflect new speed
  videoElem.playbackRate = videoSpeed;
  playBackTextElem.textContent = `${videoSpeed}x`;
  LSset(VIDEO_SPEED_KEY, videoSpeed);
});
