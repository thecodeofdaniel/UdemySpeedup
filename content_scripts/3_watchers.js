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
  playbackPopupElem = null;

  if (isOnVideoURL()) {
    setPlayback();
    changePlaybackText();
    findNextVidBtn();
    watchProgressBar();
    listenPlaybackPopup();
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

const udemyPlaybackRates = {
  '0.5x': 0.5,
  '0.75x': 0.75,
  '1x': 1,
  '1.25x': 1.25,
  '1.5x': 1.5,
  '1.75x': 1.75,
  '2x': 2,
};

/**
 * Adds event listener for popup to change playback rate natively
 */
async function listenPlaybackPopup() {
  playbackPopupElem = await waitForElement(
    'playbackPopup',
    PLAYBACK_POPUP_SELECTOR,
  );

  playbackPopupElem.addEventListener('click', (event) => {
    let speed = event.target.innerText;

    if (!(speed in udemyPlaybackRates)) return;

    speed = udemyPlaybackRates[speed];

    playBackTextElem.textContent = `${speed}x`;
    videoElem.playbackRate = speed;
    localStorage.setItem(VIDEO_SPEED_KEY, speed);
  });
}
