// What's this?: This updates the shown playback rate text whenever the user
//               switches tabs to a another Udemy video. In order to reflect the
//               correct playback speed.

async function changePlaybackText() {
  if (!playBackTextElem) {
    playBackTextElem = await waitForElement(
      'playbackTextElem',
      PLAYBACK_TEXT_SELECTOR,
    );
  }

  const videoSpeed = await getVideoSpeed();
  playBackTextElem.textContent = `${videoSpeed}x`;
}

if (isOnVideoURL()) {
  changePlaybackText();
}
