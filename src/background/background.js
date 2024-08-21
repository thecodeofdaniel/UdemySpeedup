// What's this?: It controls whether the extension is enabled based on the URL
//               they're on. Should be enabled when they're Udemy lecture. It
//               also runs a content script when clicking on a different tab.
//               Updating the playback text.
// NOTE:         To view the console on the extension side. You need to visit
//               about:debugging. Click "This Firefox" > "Inspect".

// Declare path to content script
const CONTENT_SCRIPT_PATH = '/src/content_scripts/5_update_playback_text.js';

/**
 * Checks if extension should be enabled or not
 * @returns {void}
 */
function logCurrentTabUrl() {
  browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      const tabUrl = tabs[0].url;
      const tabId = tabs[0].id;

      if (tabs.length > 0 && tabUrl) {
        // Check if the URL matches pattern
        if (UDEMY_VIDEO_URL_PATTERN.test(tabUrl)) {
          // Enable extension features for this site
          browser.browserAction.enable(tabId);
        } else {
          // Disable extension features for other sites
          browser.browserAction.disable(tabId);
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching tab information:', error);
    });
}

// Listen for tab URL changes and update extension state
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    logCurrentTabUrl();
  }
});

// Listen for tab activations and update extension state and execute script
browser.tabs.onActivated.addListener((activeInfo) => {
  logCurrentTabUrl();
  const tabId = activeInfo.tabId;

  browser.tabs
    .get(tabId)
    .then((tab) => {
      if (UDEMY_VIDEO_URL_PATTERN.test(tab.url)) {
        browser.tabs
          .executeScript(tabId, {
            file: CONTENT_SCRIPT_PATH,
          })
          .catch((error) =>
            console.error(`Failed to execute content script: ${error}`),
          );
      }
    })
    .catch((error) => console.error(`Failed to get active tab: ${error}`));
});

// Run on startup
logCurrentTabUrl();
