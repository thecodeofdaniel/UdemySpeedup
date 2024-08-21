// What's this?: When the page is first rendered or reloaded. This is where we
//               initially run our functions.

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

watchURLChanges();
applyPlaybackToNewVid(false);
