// What's this do?: This updates the DOM, in this case the shown playback rate
//                  text between the "rewind" and "foward" 5 seconds buttons

async function changePlaybackText() {
  if (!playBackTextElem) {
    playBackTextElem = await waitForElement(
      'playbackTextElem',
      PLAYBACK_TEXT_SELECTOR,
      500,
    );
  }

  const videoSpeed = localStorage.getItem(VIDEO_SPEED_KEY) || null;

  if (videoSpeed) {
    playBackTextElem.textContent = `${videoSpeed}x`;
  }
}

if (isOnVideo()) {
  changePlaybackText();
}
