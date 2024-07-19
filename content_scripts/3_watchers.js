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
