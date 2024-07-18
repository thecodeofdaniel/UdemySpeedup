// What's this do?: This sets the video playback based on localStorage and gets
//                  playback rate changes from popup

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
    playBackTextElem.textContent = `${videoSpeed}x`;
  }

  localStorage.setItem(VIDEO_SPEED_KEY, videoSpeed);
  sendResponse({ speed: null });
});

// Sets user's playback speed to current video
async function setPlayback() {
  videoElem = await waitForElement('videoElem', 'video');

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

// Watch and detects if new lecture/topic is selected
async function watchForNewVid() {
  sidebarElem = await waitForElement('sidebarElem', SIDEBAR_SELECTOR);

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
          nextButtonElem = null;
          progressBarElem = null;

          runForNextVideo();
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

async function findNextBtn() {
  nextButtonElem = await waitForElement('nextButtonElem', NEXT_BUTTON_SELECTOR);
}

async function watchProgressBar() {
  progressBarElem = await waitForElement(
    'progressBarElem',
    PROGRESS_BAR_SELECTOR,
  );

  // Create a callback function to execute when mutations are observed
  const callback = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-valuenow'
      ) {
        const currentValue = progressBarElem.getAttribute('aria-valuenow');
        if (currentValue === '100') {
          observer.disconnect();
          nextButtonElem.click();

          videoElem = null;
          playBackTextElem = null;
          nextButtonElem = null;
          progressBarElem = null;

          runForNextVideo();
        } else {
          console.log('Value is: ', currentValue);
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for attribute changes
  observer.observe(progressBarElem, { attributes: true });
}

function runForNextVideo() {
  if (isOnVideo()) {
    setPlayback();
    changePlaybackText();
    findNextBtn();
    watchProgressBar();
  }
}

watchForNewVid();

if (isOnVideo()) {
  setPlayback();
  findNextBtn();
  watchProgressBar();
}
