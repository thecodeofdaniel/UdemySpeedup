// What's this do?: This updates the shown playback rate text whenever the
//                  user switches tabs to a another Udemy video. In order to
//                  reflect the correct playback speed.

async function changePlaybackText() {
  if (!playBackTextElem) {
    playBackTextElem = await waitForElement(
      'playbackTextElem',
      PLAYBACK_TEXT_SELECTOR,
    );
  }

  browser.storage.local.get(VIDEO_SPEED_KEY, (result) => {
    playBackTextElem.textContent = `${result[VIDEO_SPEED_KEY]}x`;
  });
}

if (isOnVideoURL()) {
  changePlaybackText();
}
