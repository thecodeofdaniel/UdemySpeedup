// What's this do?: This sets the video playback based on the popup's
//                  playback value

// NOTE: To view the console you need to visit about:debugging. Navigate to the
//       extension and click on "Inspect".

const VIDEO_SPEED_KEY = 'videoSpeed';
const SIDEBAR_SELECTOR = 'div[data-purpose=sidebar-content]';
// const CURRENT_VIDEO_SELECTOR = 'li[aria-current="true"]';

let video;
let sidebarElement;

// Listen for messages from popup extension to change the playback rate
browser.runtime.onMessage.addListener((message) => {
  if (!message || !message.videoSpeed) {
    return;
  }

  const videoSpeed = message.videoSpeed;

  localStorage.setItem(VIDEO_SPEED_KEY, videoSpeed);
  video.playbackRate = +videoSpeed;
});

// Sleeper function that returns a promise
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sets user's playback speed to current video
function setPlayback() {
  const apply = () => {
    const videoSpeed = localStorage.getItem(VIDEO_SPEED_KEY);
    if (videoSpeed) {
      video.playbackRate = +videoSpeed;
    }
  };

  // Set the initial playback rate
  apply();

  // Add event listeners to ensure playback rate persists
  video.addEventListener('play', apply);
  video.addEventListener('loadedmetadata', apply);
  video.addEventListener('ratechange', apply);
}

// Waits for video to render and runs "setPlayback" function
async function applyPlaybackToNewVid() {
  do {
    await sleep(1000);
    video = document.querySelector('video');
  } while (!video);

  setPlayback();
}

// Watch and detects if new video is selected
async function watchForNewVid() {
  do {
    await sleep(1000);
    sidebarElement = document.querySelector(SIDEBAR_SELECTOR);
  } while (!sidebarElement);

  const attributeName = 'aria-current';

  const onAttributesChanged = (mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === attributeName
      ) {
        const target = mutation.target;
        if (target.getAttribute(attributeName) === 'true') {
          video = null;
          applyPlaybackToNewVid();
        }
      }
    }
  };

  const observer = new MutationObserver(onAttributesChanged);

  // Start observing the target node for configured mutations
  observer.observe(sidebarElement, {
    attributes: true,
    subtree: true,
    attributeFilter: [attributeName],
  });
}

applyPlaybackToNewVid();
watchForNewVid();
