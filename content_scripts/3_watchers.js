// What's this do?: These functions watch for any changes inside their elements.
//                  Triggering some functions to run.

/**
 * Resets all elements relating to video and applys neccessary js to new video
 */
function applyPlaybackToNewVid() {
  videoElem = null;
  playBackTextElem = null;
  progressBarElem = null;
  nextButtonElem = null;

  if (isOnVideoURL()) {
    setPlayback();
    changePlaybackText();
    findNextVidBtn();
    watchProgressBar();
    watchPlaybackText();
  }
}

/**
 * Watches for any URL changes.
 */
function watchURLChanges() {
  let currentURL = window.location.href;

  const handleURLChange = () => {
    const newURL = window.location.href;
    if (newURL !== currentURL) {
      currentURL = newURL;
      applyPlaybackToNewVid();
    }
  };

  // Create a MutationObserver to watch for changes in the document title
  const observer = new MutationObserver(handleURLChange);
  observer.observe(document.querySelector('title'), { childList: true });

  // Fallback: periodically check the URL (in case the MutationObserver doesn't catch it)
  setInterval(handleURLChange, 1000);
}

/**
 * Watches the progress bar and checks if video is 100% complete. If so,
 * simulate user clicking "next video" button
 */
async function watchProgressBar() {
  progressBarElem = await waitForElement(
    'progressBarElem',
    PROGRESS_BAR_SELECTOR,
  );

  // Create a callback function to execute when mutations are observed
  const handleCompleteProgressBar = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-valuenow'
      ) {
        const currentValue = progressBarElem.getAttribute('aria-valuenow');
        if (currentValue === '100') {
          observer.disconnect();
          if (localStorage.getItem(SKIP_DELAY_KEY) === 'true') {
            nextButtonElem.click();
          }
        }
      }
    }
  };

  const observer = new MutationObserver(handleCompleteProgressBar);
  observer.observe(progressBarElem, { attributes: true });
}

const playbackRates = {
  '0.5x': 0.5,
  '0.75x': 0.75,
  '1x': 1,
  '1.25x': 1.25,
  '1.5x': 1.5,
  '1.75x': 1.75,
  '2x': 2,
};

async function watchPlaybackText() {
  if (!playBackTextElem) {
    playBackTextElem = await waitForElement(
      'playbackTextElem',
      PLAYBACK_TEXT_SELECTOR,
    );
  }

  // Function to run when changes are detected
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        // Execute your function here when text content changes
        let playbackText = mutation.target.textContent;

        if (!(playbackText in playbackRates)) return;

        const playbackSpeed = playbackRates[playbackText];

        if (localStorage.getItem(VIDEO_SPEED_KEY) == playbackSpeed) {
          console.log('already applied');
        } else {
          localStorage.setItem(VIDEO_SPEED_KEY, playbackSpeed);
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(playBackTextElem, {
    subtree: true,
    characterData: true,
    childList: true,
  });
}
