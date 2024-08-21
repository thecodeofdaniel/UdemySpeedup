// What's this do?: When the page is first rendered or reloaded. This is where
//                  we initially run our functions.

/**
 * Set's video playback speed.
 */
async function setPlayback() {
  videoElem = await waitForElement('videoElem', VIDEO_SELECTOR);

  const apply = () => {
    browser.storage.local.get(VIDEO_SPEED_KEY, (result) => {
      videoElem.playbackRate = result[VIDEO_SPEED_KEY];
    });
  };

  // Set the initial playback rate
  apply();

  // Add event listeners to ensure playback rate persists
  videoElem.addEventListener('play', apply);
}

/**
 * Finds the "next video" button element.
 */
async function findNextVidBtn() {
  nextButtonElem = await waitForElement('nextButtonElem', NEXT_BUTTON_SELECTOR);
}

watchURLChanges();
applyPlaybackToNewVid((firstRun = true));
