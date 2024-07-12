// What's this do?: This sets the video playback based on the popup's
//                  playback value

// NOTE: To view the console you need to visit about:debugging. Navigate to the
//       extension and click on "Inspect".

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if videoSpeed from localStorage exists
  let videoSpeed = localStorage.getItem(VIDEO_SPEED_KEY) || null;

  // Tell popup to use localStorage's speed for reference
  if (videoSpeed && !message.newSpeedSet) {
    sendResponse({ speed: videoSpeed });
    return;
  }

  // Otherwise accept new videoSpeed from popup
  videoSpeed = message.videoSpeed;

  if (videoElem && playBackTextElem) {
    videoElem.playbackRate = +videoSpeed;
    localStorage.setItem(VIDEO_SPEED_KEY, videoSpeed);
    playBackTextElem.textContent = `${videoSpeed}x`;
  }

  sendResponse({ speed: null });
});

// Sets user's playback speed to current video
function setPlayback() {
  const apply = () => {
    const videoSpeed = localStorage.getItem(VIDEO_SPEED_KEY);

    if (videoSpeed) {
      videoElem.playbackRate = +videoSpeed;
    }
  };

  // Set the initial playback rate
  apply();

  // Add event listeners to ensure playback rate persists
  videoElem.addEventListener('play', apply);
  videoElem.addEventListener('loadedmetadata', apply);
  videoElem.addEventListener('ratechange', apply);
}

// Waits for video to render and runs "setPlayback" function
async function applyPlaybackToNewVid() {
  videoElem = await waitForElement('video');
  setPlayback();
}

// Watch and detects if new video is selected
async function watchForNewVid() {
  sidebarElem = await waitForElement(SIDEBAR_SELECTOR);

  const attributeName = 'aria-current';

  const onAttributesChanged = (mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === attributeName
      ) {
        const target = mutation.target;
        if (target.getAttribute(attributeName) === 'true') {
          videoElem = null;
          playBackTextElem = null;
          applyPlaybackToNewVid();
          changePlaybackText();
        }
      }
    }
  };

  const observer = new MutationObserver(onAttributesChanged);

  // Start observing the target node for configured mutations
  observer.observe(sidebarElem, {
    attributes: true,
    subtree: true,
    attributeFilter: [attributeName],
  });
}

applyPlaybackToNewVid();
watchForNewVid();
