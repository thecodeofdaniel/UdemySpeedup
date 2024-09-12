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

  browser.storage.local.get(SKIP_INTRO_KEY, (result) => {
    let skipIntroSeconds = result[SKIP_INTRO_KEY];

    if (
      skipIntroSeconds === undefined ||
      skipIntroSeconds[courseName] === undefined ||
      videoElem.currentTime > skipIntroSeconds[courseName]
    )
      return;

    videoElem.currentTime = skipIntroSeconds[courseName];
  });

  // Set the initial playback rate
  applyPlayback();

  // Add event listeners to ensure playback rate persists
  videoElem.addEventListener('play', applyPlayback);
}

// For testing purposes :)
// browser.storage.local.clear();

courseName = extractCourseName(window.location.href);
watchURLChanges();
applyPlaybackToNewVid(false);
