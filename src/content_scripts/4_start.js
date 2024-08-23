// What's this?: When the page is first rendered or reloaded. This is where we
//               initially run our functions.

/**
 * Set's video playback speed.
 */
async function setPlayback() {
  videoElem = await waitForElement('videoElem', VIDEO_SELECTOR);

  const apply = async () => {
    const videoSpeed = await getVideoSpeed();
    videoElem.playbackRate = videoSpeed;
  };

  // Set the initial playback rate
  apply();

  // Add event listeners to ensure playback rate persists
  videoElem.addEventListener('play', apply);
}

// For testing purposes :)
// browser.storage.local.clear();

watchURLChanges();
applyPlaybackToNewVid(false);
