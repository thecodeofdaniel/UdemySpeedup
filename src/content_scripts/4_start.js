// What's this?: When the page is first rendered or reloaded. This is where we
//               initially run our functions.

/**
 * Set's video playback speed.
 */
async function setPlayback() {
  videoElem = await waitForElement(
    'videoElem',
    VIDEO_SELECTOR,
    globalCurrentLectureId,
  );

  if (!videoElem) return;

  // Set the initial playback rate
  applyPlayback();

  // Add event listeners to ensure playback rate persists
  videoElem.addEventListener('play', applyPlayback);
}

// For testing purposes :)
// browser.storage.local.clear();

watchURLChanges();
applyPlaybackToNewVid(false);
