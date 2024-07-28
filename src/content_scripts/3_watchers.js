// What's this do?: These functions watch for any changes inside their elements.
//                  Triggering some functions to run.

/**
 * Watches for any URL changes. If so, run functions to apply playback to next
 * video
 */
function watchURLChanges() {
  let currentURL = window.location.href;

  const handleURLChange = () => {
    const newURL = window.location.href;
    if (newURL !== currentURL) {
      currentURL = newURL;
      applyPlaybackToNewVid((firstRun = false));
    }
  };

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
          if (LSget(SKIP_DELAY_KEY) === true) {
            nextButtonElem.click();
          }
        }
      }
    }
  };

  const observer = new MutationObserver(handleCompleteProgressBar);
  observer.observe(progressBarElem, { attributes: true });
}

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

    if (!(speed in UDEMY_PLAYBACK_RATES)) return;

    speed = UDEMY_PLAYBACK_RATES[speed];

    videoElem.playbackRate = speed;
    playBackTextElem.textContent = `${speed}x`;
    localStorage.setItem(VIDEO_SPEED_KEY, speed);
  });
}
